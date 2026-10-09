const { checkReleaseTag } = require('../scripts/check-release-tag');

describe('checkReleaseTag', () => {
  it('accepts the tag for the package.json version', () => {
    expect(checkReleaseTag('v1.0.0', '1.0.0')).toBeUndefined();
    expect(checkReleaseTag('v2.13.4', '2.13.4')).toBeUndefined();
  });

  it('rejects a tag for another version', () => {
    expect(checkReleaseTag('v1.0.1', '1.0.0')).toMatch(/does not match package.json version 1.0.0/);
  });

  it.each(['1.0.0', 'v1.0', 'v1.0.0-beta', 'release-1.0.0', ''])('rejects %p, which is not vMAJOR.MINOR.PATCH', (tag) => {
    expect(checkReleaseTag(tag, '1.0.0')).toMatch(/is not vMAJOR.MINOR.PATCH/);
  });
});
