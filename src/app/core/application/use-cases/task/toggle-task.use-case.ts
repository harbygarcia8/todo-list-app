import { TaskId } from '../../../domain/task/task-id';
import { TaskRepository } from '../../ports/task-repository.port';

export class ToggleTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(id: TaskId): Promise<void> {
    const task = await this.tasks.findById(id);
    if (!task) {
      return;
    }
    await this.tasks.save(task.toggle());
  }
}
