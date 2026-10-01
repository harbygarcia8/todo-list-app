import { ToggleTaskUseCase } from './toggle-task.use-case';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { InMemoryTaskRepository } from '../../../../../testing/fakes';

const seedTask = () =>
  Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('X'), createdAt: 1 });

describe('ToggleTaskUseCase', () => {
  it('alterna el estado de completado de una tarea existente', async () => {
    const repo = new InMemoryTaskRepository([seedTask()]);
    const uc = new ToggleTaskUseCase(repo);

    await uc.execute(TaskId.of('t1'));

    expect((await repo.findById(TaskId.of('t1')))?.completed).toBeTrue();
  });

  it('es un no-op silencioso si la tarea no existe', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new ToggleTaskUseCase(repo);

    await expectAsync(uc.execute(TaskId.of('missing'))).toBeResolved();
    expect((await repo.findAll()).length).toBe(0);
  });
});
