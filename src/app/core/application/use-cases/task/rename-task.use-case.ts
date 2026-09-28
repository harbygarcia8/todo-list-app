import { Result, ok } from '../../../domain/shared/result';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { TaskTitleError } from '../../../domain/task/task.errors';
import { TaskRepository } from '../../ports/task-repository.port';

/** Renombra una tarea. Falla si el nuevo título no es válido. */
export class RenameTaskUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(id: TaskId, rawTitle: string): Promise<Result<void, TaskTitleError>> {
    const title = TaskTitle.create(rawTitle);
    if (!title.ok) {
      return title;
    }
    const task = await this.tasks.findById(id);
    if (task) {
      await this.tasks.save(task.rename(title.value));
    }
    return ok(undefined);
  }
}
