const { getTimeLimit, runWithTimeLimit } = require('../scripts/run-tests');

/** Run a snippet of Node in a child process under the wrapper. */
const runNode = (code, limitMs, options) => runWithTimeLimit(process.execPath, ['-e', code], limitMs, options);

describe('getTimeLimit', () => {
  it.each([[[]], [['__tests__/seo.test.tsx']]])('caps a run with %j at three minutes', (args) => {
    expect(getTimeLimit(args)).toBe(3 * 60 * 1000);
  });

  it.each([[['--watch']], [['--coverage', '--watchAll']]])('leaves %j unlimited', (args) => {
    expect(getTimeLimit(args)).toBeNull();
  });
});

describe('runWithTimeLimit', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it.each([0, 3])('passes exit code %p through', async (code) => {
    await expect(runNode(`process.exit(${code})`, 5000)).resolves.toBe(code);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('fails a run that a signal ends', async () => {
    await expect(runNode("process.kill(process.pid, 'SIGKILL')", 5000)).resolves.toBe(1);
  });

  it('stops a run that outlives its limit and says why', async () => {
    await expect(runNode('setInterval(() => {}, 1000)', 200)).resolves.toBe(1);
    expect(consoleError).toHaveBeenCalledWith(
      'Test run stopped: still running after 0.2 s, the limit for one run.',
    );
  });

  it('kills a run that ignores the stop signal', async () => {
    const stubborn = "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000)";
    await expect(runNode(stubborn, 800, { graceMs: 100 })).resolves.toBe(1);
  });
});
