import { CategoryName } from './category-name.vo';

describe('CategoryName (Value Object)', () => {
  it('crea un nombre válido y recorta espacios', () => {
    const result = CategoryName.create('  Trabajo  ');
    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value as string).toBe('Trabajo');
    }
  });

  it('rechaza un nombre vacío con EmptyCategoryNameError', () => {
    const result = CategoryName.create('   ');
    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('EmptyCategoryName');
      expect(result.error.message).toContain('vacío');
    }
  });

  it('of() reconstruye sin validar', () => {
    expect(CategoryName.of('x') as string).toBe('x');
  });
});
