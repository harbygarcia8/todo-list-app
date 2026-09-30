import { CategoryColor } from './category-color.vo';

describe('CategoryColor (Value Object)', () => {
  it('acepta un hexadecimal válido #RRGGBB', () => {
    const result = CategoryColor.create('#3880ff');
    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value as string).toBe('#3880ff');
    }
  });

  it('acepta mayúsculas', () => {
    expect(CategoryColor.create('#ABCDEF').ok).toBeTrue();
  });

  for (const invalid of ['3880ff', '#38f', '#3880f', '#3880fg', '#3880ff0', 'rgb(0,0,0)', '']) {
    it(`rechaza "${invalid}" con InvalidCategoryColorError`, () => {
      const result = CategoryColor.create(invalid);
      expect(result.ok).toBeFalse();
      if (!result.ok) {
        expect(result.error.kind).toBe('InvalidCategoryColor');
        expect(result.error.value).toBe(invalid);
        expect(result.error.message).toContain('#RRGGBB');
      }
    });
  }

  it('of() reconstruye sin validar', () => {
    expect(CategoryColor.of('#000000') as string).toBe('#000000');
  });
});
