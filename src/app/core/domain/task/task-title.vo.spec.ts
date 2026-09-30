import { TaskTitle } from './task-title.vo';

describe('TaskTitle (Value Object)', () => {
  it('crea un título válido y recorta espacios', () => {
    const result = TaskTitle.create('  Comprar pan  ');
    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value as string).toBe('Comprar pan');
    }
  });

  it('rechaza un título vacío con EmptyTaskTitleError', () => {
    const result = TaskTitle.create('   ');
    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('EmptyTaskTitle');
      expect(result.error.message).toContain('vacío');
    }
  });

  it('rechaza un título demasiado largo con TaskTitleTooLongError', () => {
    const result = TaskTitle.create('a'.repeat(201));
    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('TaskTitleTooLong');
      if (result.error.kind === 'TaskTitleTooLong') {
        expect(result.error.max).toBe(200);
        expect(result.error.message).toContain('200');
      }
    }
  });

  it('acepta exactamente el máximo (200)', () => {
    const result = TaskTitle.create('a'.repeat(200));
    expect(result.ok).toBeTrue();
  });

  it('of() reconstruye sin validar', () => {
    expect(TaskTitle.of('cualquier cosa') as string).toBe('cualquier cosa');
  });
});
