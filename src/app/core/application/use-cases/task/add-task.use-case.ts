import { CategoryId } from '../../../domain/category/category-id';
import { Result, ok } from '../../../domain/shared/result';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { TaskTitleError } from '../../../domain/task/task.errors';
import { Task } from '../../../domain/task/task.entity';
import { Clock } from '../../ports/clock.port';
import { IdGenerator } from '../../ports/id-generator.port';
import { TaskRepository } from '../../ports/task-repository.port';

export interface AddTaskInput {
  title: string;
  categoryId?: CategoryId | null;
}

/** Crea y persiste una tarea nueva. Falla si el título no es válido. */
export class AddTaskUseCase {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock,
  ) {}

  async execute(input: AddTaskInput): Promise<Result<Task, TaskTitleError>> {
    const title = TaskTitle.create(input.title);
    if (!title.ok) {
      return title; // propaga el error de validación
    }
    const task = Task.create({
      id: TaskId.of(this.ids.generate()),
      title: title.value,
      categoryId: input.categoryId ?? null,
      createdAt: this.clock.now(),
    });
    await this.tasks.save(task);
    return ok(task);
  }
}
