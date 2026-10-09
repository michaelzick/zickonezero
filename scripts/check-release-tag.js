const { version } = require('../package.json');

const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;

/**
 * A release tag is vMAJOR.MINOR.PATCH and names the version package.json
 * ships, so a tag can't publish a release under the wrong number. Returns
 * the problem, or undefined when the tag is good.
 */
function checkReleaseTag(tag, packageVersion) {
  if (!RELEASE_TAG.test(tag)) {
    return `Release tag "${tag}" is not vMAJOR.MINOR.PATCH.`;
  }
  if (tag !== `v${packageVersion}`) {
    return `Release tag "${tag}" does not match package.json version ${packageVersion}; bump the version in the release PR first.`;
  }
  return undefined;
}

module.exports = { checkReleaseTag };

if (require.main === module) {
  const problem = checkReleaseTag(process.argv[2] ?? '', version);
  if (problem) {
    console.error(problem);
    process.exitCode = 1;
  } else {
    console.log(`Release tag ${process.argv[2]} matches package.json.`);
  }
}
