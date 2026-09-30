import { SystemClock } from './system-clock';

describe('SystemClock', () => {
  it('now() devuelve un timestamp cercano a Date.now()', () => {
    const before = Date.now();
    const value = new SystemClock().now();
    const after = Date.now();
    expect(value).toBeGreaterThanOrEqual(before);
    expect(value).toBeLessThanOrEqual(after);
  });
});
