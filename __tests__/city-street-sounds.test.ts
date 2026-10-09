import * as streetSounds from '../src/lib/city/streetSounds';
import { FakeAudioContext, FakeNode } from '../src/test/fakeAudioContext';

const SOUNDS = [
  'traffic',
  'lateCar',
  'horns',
  'birds',
  'siren',
  'helicopter',
  'gust',
  'crickets',
  'train',
] as const;

// Enough plays to reach each sound's rarer branches (replies, yelps, trucks).
const PLAYS = 25;

describe('street sounds', () => {
  it.each(SOUNDS)('%s plays within its reported length and unplugs itself when it ends', (name) => {
    for (let play = 0; play < PLAYS; play += 1) {
      const ctx = new FakeAudioContext();
      const street = streetSounds.createStreet(ctx.asContext(), new FakeNode() as unknown as AudioNode);
      const before = ctx.nodes.length;
      const when = 2;

      const seconds = streetSounds[name](street, when);

      expect(Number.isFinite(seconds)).toBe(true);
      expect(seconds).toBeGreaterThan(0);

      const added = ctx.nodes.slice(before);
      const sources = added.filter((node) => node.start.mock.calls.length > 0);
      expect(sources.length).toBeGreaterThan(0);
      sources.forEach((source) => {
        expect(source.start.mock.calls[0][0]).toBeGreaterThanOrEqual(when);
        expect(source.stop.mock.calls[0][0]).toBeLessThanOrEqual(when + seconds + 1e-9);
      });

      const plugged = () => added.filter((node) => node.outputs.has(street.out) || node.outputs.has(street.echo));
      expect(plugged().length).toBeGreaterThan(0);

      sources.forEach((source) => source.dispatchEvent(new Event('ended')));

      expect(plugged()).toHaveLength(0);
    }
  });

  it('gives each talker a phrase of a few seconds at most', () => {
    const ctx = new FakeAudioContext();
    const talker = streetSounds.createTalker(ctx.asContext(), new FakeNode() as unknown as AudioNode);

    for (let phrase = 0; phrase < PLAYS; phrase += 1) {
      const end = talker.speak(10);

      expect(end).toBeGreaterThan(10.1);
      expect(end).toBeLessThan(10 + 6);
    }
  });
});
