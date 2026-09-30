import { Category } from '../../../domain/category/category.entity';
import { CategoryRepository } from '../../ports/category-repository.port';

export class ListCategoriesUseCase {
  constructor(private readonly categories: CategoryRepository) {}

  execute(): Promise<readonly Category[]> {
    return this.categories.findAll();
  }
}
