import { Category } from '../../domain/category/category.entity';
import { CategoryId } from '../../domain/category/category-id';

/**
 * Puerto de persistencia de categorías (driven port).
 */
export interface CategoryRepository {
  /** Devuelve todas las categorías. */
  findAll(): Promise<readonly Category[]>;

  /** Busca una categoría por id (o `null`). */
  findById(id: CategoryId): Promise<Category | null>;

  /** Inserta o actualiza una categoría (upsert). */
  save(category: Category): Promise<void>;

  /** Elimina una categoría por id. */
  delete(id: CategoryId): Promise<void>;
}
