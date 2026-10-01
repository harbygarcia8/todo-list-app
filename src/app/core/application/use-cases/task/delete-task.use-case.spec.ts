import { DeleteTaskUseCase } from './delete-task.use-case';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { InMemoryTaskRepository } from '../../../../../testing/fakes';

describe('DeleteTaskUseCase', () => {
  it('elimina la tarea por id', async () => {
    const task = Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('X'), createdAt: 1 });
    const repo = new InMemoryTaskRepository([task]);
    const uc = new DeleteTaskUseCase(repo);

    await uc.execute(TaskId.of('t1'));

    expect((await repo.findAll()).length).toBe(0);
  });
});
