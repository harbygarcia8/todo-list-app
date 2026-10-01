import { ListTasksUseCase } from './list-tasks.use-case';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { InMemoryTaskRepository } from '../../../../../testing/fakes';

describe('ListTasksUseCase', () => {
  it('devuelve todas las tareas del repositorio', async () => {
    const tasks = [
      Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('A'), createdAt: 1 }),
      Task.create({ id: TaskId.of('t2'), title: TaskTitle.of('B'), createdAt: 2 }),
    ];
    const uc = new ListTasksUseCase(new InMemoryTaskRepository(tasks));

    expect((await uc.execute()).length).toBe(2);
  });

  it('devuelve lista vacía si no hay tareas', async () => {
    const uc = new ListTasksUseCase(new InMemoryTaskRepository());
    expect(await uc.execute()).toEqual([]);
  });
});
