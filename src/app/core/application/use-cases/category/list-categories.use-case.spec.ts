import { ListCategoriesUseCase } from './list-categories.use-case';
import { Category } from '../../../domain/category/category.entity';
import { CategoryId } from '../../../domain/category/category-id';
import { CategoryName } from '../../../domain/category/category-name.vo';
import { CategoryColor } from '../../../domain/category/category-color.vo';
import { InMemoryCategoryRepository } from '../../../../../testing/fakes';

describe('ListCategoriesUseCase', () => {
  it('devuelve todas las categorías', async () => {
    const repo = new InMemoryCategoryRepository([
      Category.create({
        id: CategoryId.of('c1'),
        name: CategoryName.of('Trabajo'),
        color: CategoryColor.of('#3880ff'),
        createdAt: 1,
      }),
    ]);
    const uc = new ListCategoriesUseCase(repo);

    expect((await uc.execute()).length).toBe(1);
  });

  it('devuelve lista vacía si no hay categorías', async () => {
    const uc = new ListCategoriesUseCase(new InMemoryCategoryRepository());
    expect(await uc.execute()).toEqual([]);
  });
});
