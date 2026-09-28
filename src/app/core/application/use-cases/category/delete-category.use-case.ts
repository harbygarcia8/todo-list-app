import { CategoryId } from '../../../domain/category/category-id';
import { CategoryRepository } from '../../ports/category-repository.port';
import { TaskRepository } from '../../ports/task-repository.port';

/**
 * Elimina una categoría y aplica la regla de negocio en CASCADA:
 * las tareas que la tenían asignada quedan sin categoría (no quedan
 * referencias huérfanas).
 *
 * Coordina dos agregados (Task y Category) desde la capa de aplicación,
 * que es su lugar correcto: ninguna entidad conoce a la otra.
 */
export class DeleteCategoryUseCase {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly tasks: TaskRepository,
  ) {}

  async execute(id: CategoryId): Promise<void> {
    const all = await this.tasks.findAll();
    const affected = all.filter((task) => task.categoryId === id);

    for (const task of affected) {
      await this.tasks.save(task.assignCategory(null));
    }

    await this.categories.delete(id);
  }
}
