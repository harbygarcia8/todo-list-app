import { CategoryId } from '../../../domain/category/category-id';
import { CategoryRepository } from '../../ports/category-repository.port';
import { TaskRepository } from '../../ports/task-repository.port';

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
