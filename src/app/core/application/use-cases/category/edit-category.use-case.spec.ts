import { EditCategoryUseCase } from './edit-category.use-case';
import { Category } from '../../../domain/category/category.entity';
import { CategoryId } from '../../../domain/category/category-id';
import { CategoryName } from '../../../domain/category/category-name.vo';
import { CategoryColor } from '../../../domain/category/category-color.vo';
import { InMemoryCategoryRepository } from '../../../../../testing/fakes';

const seed = () =>
  Category.create({
    id: CategoryId.of('c1'),
    name: CategoryName.of('Trabajo'),
    color: CategoryColor.of('#3880ff'),
    createdAt: 1,
  });

describe('EditCategoryUseCase', () => {
  it('edita solo el nombre', async () => {
    const repo = new InMemoryCategoryRepository([seed()]);
    const uc = new EditCategoryUseCase(repo);

    const result = await uc.execute(CategoryId.of('c1'), { name: 'Personal' });

    expect(result.ok).toBeTrue();
    const saved = await repo.findById(CategoryId.of('c1'));
    expect(saved?.name as string).toBe('Personal');
    expect(saved?.color as string).toBe('#3880ff');
  });

  it('edita solo el color', async () => {
    const repo = new InMemoryCategoryRepository([seed()]);
    const uc = new EditCategoryUseCase(repo);

    await uc.execute(CategoryId.of('c1'), { color: '#2dd36f' });

    expect((await repo.findById(CategoryId.of('c1')))?.color as string).toBe('#2dd36f');
  });

  it('rechaza nombre inválido', async () => {
    const repo = new InMemoryCategoryRepository([seed()]);
    const result = await new EditCategoryUseCase(repo).execute(CategoryId.of('c1'), { name: ' ' });
    expect(result.ok).toBeFalse();
  });

  it('rechaza color inválido', async () => {
    const repo = new InMemoryCategoryRepository([seed()]);
    const result = await new EditCategoryUseCase(repo).execute(CategoryId.of('c1'), {
      color: 'x',
    });
    expect(result.ok).toBeFalse();
  });

  it('es no-op (ok) si la categoría no existe', async () => {
    const repo = new InMemoryCategoryRepository();
    const result = await new EditCategoryUseCase(repo).execute(CategoryId.of('missing'), {
      name: 'Y',
    });
    expect(result.ok).toBeTrue();
  });
});
