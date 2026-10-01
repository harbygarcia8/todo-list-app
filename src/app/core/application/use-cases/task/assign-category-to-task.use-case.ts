import { CategoryId } from '../../../domain/category/category-id';
import { TaskId } from '../../../domain/task/task-id';
import { TaskRepository } from '../../ports/task-repository.port';

export class AssignCategoryToTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(taskId: TaskId, categoryId: CategoryId | null): Promise<void> {
    const task = await this.tasks.findById(taskId);
    if (!task) {
      return;
    }
    await this.tasks.save(task.assignCategory(categoryId));
  }
}
