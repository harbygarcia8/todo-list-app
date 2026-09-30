import { Result, ok, err, isOk, isErr } from './result';

describe('Result<T, E>', () => {
  it('ok() construye la rama exitosa', () => {
    const r = ok(42);
    expect(r.ok).toBeTrue();
    if (r.ok) {
      expect(r.value).toBe(42);
    }
  });

  it('err() construye la rama fallida', () => {
    const r = err('boom');
    expect(r.ok).toBeFalse();
    if (!r.ok) {
      expect(r.error).toBe('boom');
    }
  });

  it('isOk() estrecha a la rama exitosa', () => {
    const r: Result<number, string> = ok(1);
    expect(isOk(r)).toBeTrue();
    expect(isErr(r)).toBeFalse();
  });

  it('isErr() estrecha a la rama fallida', () => {
    const r: Result<number, string> = err('x');
    expect(isErr(r)).toBeTrue();
    expect(isOk(r)).toBeFalse();
  });
});
