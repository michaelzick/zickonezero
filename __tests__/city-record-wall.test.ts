import { generateRecordWall, RECORD_TONES, RecordWallOptions } from '../src/lib/city/recordWall';

const OPTIONS: RecordWallOptions = {
  seed: 404,
  width: 1600,
  height: 560,
  rows: 4,
  shelfThickness: 8,
  minSpine: 6,
  maxSpine: 14,
  minRun: 5,
  maxRun: 14,
  maxDrop: 46,
  sleeves: 6,
};

const numbersIn = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe('record wall', () => {
  it('draws the same wall for the same seed, and a different one for another', () => {
    expect(generateRecordWall(OPTIONS)).toEqual(generateRecordWall(OPTIONS));
    expect(generateRecordWall({ ...OPTIONS, seed: 405 }).spines).not.toEqual(generateRecordWall(OPTIONS).spines);
  });

  it('keeps one path per tone, in whole units, inside the wall', () => {
    const wall = generateRecordWall(OPTIONS);

    expect(wall.spines).toHaveLength(RECORD_TONES.length);
    [wall.shelves, ...wall.spines].forEach((path) => {
      numbersIn(path).forEach((value) => expect(Number.isInteger(value)).toBe(true));
    });

    // Absolute moves are the spines' top-left corners.
    wall.spines.join('').match(/M\d+ \d+/g)?.forEach((move) => {
      const [x, y] = numbersIn(move);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(OPTIONS.width);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(OPTIONS.height);
    });
  });

  it('turns every sleeve face-out on a shelf, clear of the title', () => {
    const { sleeves } = generateRecordWall(OPTIONS);

    expect(sleeves).toHaveLength(OPTIONS.sleeves);
    sleeves.forEach(({ x, y, size, tone }) => {
      [x, y, size].forEach((value) => expect(Number.isInteger(value)).toBe(true));
      expect(x + size).toBeLessThanOrEqual(OPTIONS.width);
      expect(y).toBeGreaterThanOrEqual(0);
      // The middle of the wall sits behind the title, so sleeves keep to the sides.
      expect(x + size / 2 < OPTIONS.width * 0.35 || x > OPTIONS.width * 0.6).toBe(true);
      expect(RECORD_TONES[tone]).toBeDefined();
    });
  });
});
