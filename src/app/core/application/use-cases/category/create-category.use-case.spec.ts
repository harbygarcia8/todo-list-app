import { CreateCategoryUseCase } from './create-category.use-case';
import {
  FixedClock,
  FixedIdGenerator,
  InMemoryCategoryRepository,
} from '../../../../../testing/fakes';

describe('CreateCategoryUseCase', () => {
  const build = () =>
    new CreateCategoryUseCase(
      new InMemoryCategoryRepository(),
      new FixedIdGenerator(['c1']),
      new FixedClock(500),
    );

  it('crea y persiste una categoría válida', async () => {
    const repo = new InMemoryCategoryRepository();
    const uc = new CreateCategoryUseCase(repo, new FixedIdGenerator(['c1']), new FixedClock(500));

    const result = await uc.execute({ name: '  Trabajo  ', color: '#3880ff' });

    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value.id as string).toBe('c1');
      expect(result.value.name as string).toBe('Trabajo');
      expect(result.value.color as string).toBe('#3880ff');
      expect(result.value.createdAt).toBe(500);
    }
    expect((await repo.findAll()).length).toBe(1);
  });

  it('rechaza un nombre vacío', async () => {
    const result = await build().execute({ name: '  ', color: '#3880ff' });
    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('EmptyCategoryName');
    }
  });

  it('rechaza un color inválido', async () => {
    const result = await build().execute({ name: 'Trabajo', color: 'azul' });
    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('InvalidCategoryColor');
    }
  });
});
