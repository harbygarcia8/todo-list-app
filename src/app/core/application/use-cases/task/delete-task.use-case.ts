import { TaskId } from '../../../domain/task/task-id';
import { TaskRepository } from '../../ports/task-repository.port';

export class DeleteTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(id: TaskId): Promise<void> {
    await this.tasks.delete(id);
  }
}
