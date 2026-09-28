import { Task } from '../../../domain/task/task.entity';
import { TaskRepository } from '../../ports/task-repository.port';

/** Devuelve todas las tareas. */
export class ListTasksUseCase {
  constructor(private readonly tasks: TaskRepository) {}

  execute(): Promise<readonly Task[]> {
    return this.tasks.findAll();
  }
}
