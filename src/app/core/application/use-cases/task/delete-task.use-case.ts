import { TaskId } from '../../../domain/task/task-id';
import { TaskRepository } from '../../ports/task-repository.port';

/** Elimina una tarea por id. */
export class DeleteTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(id: TaskId): Promise<void> {
    await this.tasks.delete(id);
  }
}
