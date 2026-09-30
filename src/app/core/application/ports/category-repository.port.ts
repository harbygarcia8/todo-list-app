import { Category } from '../../domain/category/category.entity';
import { CategoryId } from '../../domain/category/category-id';

export interface CategoryRepository {
  findAll(): Promise<readonly Category[]>;
  findById(id: CategoryId): Promise<Category | null>;
  save(category: Category): Promise<void>;
  delete(id: CategoryId): Promise<void>;
}
