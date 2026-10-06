#!/usr/bin/env node
// Run Jest in band, stopped once it passes the time limit so a hung test fails
// fast instead of stalling local checks or CI. Arguments pass through to Jest
// (`npm test -- __tests__/seo.test.tsx`). Watch mode is interactive, so it runs
// without the limit.
const { spawn } = require('child_process');

const TEST_TIME_LIMIT_MS = 3 * 60 * 1000;
// How long a stopped run gets to exit after SIGTERM before it is killed.
const KILL_GRACE_MS = 5000;
const WATCH_FLAGS = new Set(['--watch', '--watchAll']);
const FORWARDED_SIGNALS = ['SIGINT', 'SIGTERM'];

const formatLimit = (ms) => (ms % 60000 === 0 ? `${ms / 60000} min` : `${ms / 1000} s`);

/** The time limit for a Jest run with these arguments, or null in watch mode. */
const getTimeLimit = (args) => (args.some((arg) => WATCH_FLAGS.has(arg)) ? null : TEST_TIME_LIMIT_MS);

/**
 * Run a command with inherited output and resolve with its exit code. A run
 * still going after limitMs (null for no limit) is sent SIGTERM, then SIGKILL
 * after graceMs, and resolves 1, as does a run that a signal ends. Signals sent
 * to this process are passed on, so stopping the wrapper never orphans the run.
 */
function runWithTimeLimit(command, args, limitMs, { graceMs = KILL_GRACE_MS } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    const forward = (signal) => child.kill(signal);
    let timedOut = false;
    let killTimer;

    const limitTimer = limitMs === null ? undefined : setTimeout(() => {
      timedOut = true;
      console.error(`Test run stopped: still running after ${formatLimit(limitMs)}, the limit for one run.`);
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), graceMs);
    }, limitMs);

    const settle = () => {
      clearTimeout(limitTimer);
      clearTimeout(killTimer);
      FORWARDED_SIGNALS.forEach((signal) => process.off(signal, forward));
    };

    FORWARDED_SIGNALS.forEach((signal) => process.on(signal, forward));
    child.on('error', (error) => {
      settle();
      reject(error);
    });
    child.on('exit', (code) => {
      settle();
      resolve(timedOut || code === null ? 1 : code);
    });
  });
}

module.exports = { getTimeLimit, runWithTimeLimit };

if (require.main === module) {
  const args = process.argv.slice(2);

  runWithTimeLimit(process.execPath, [require.resolve('jest/bin/jest'), '--runInBand', ...args], getTimeLimit(args))
    .then((code) => {
      process.exitCode = code;
    }, (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
