import { RenameTaskUseCase } from './rename-task.use-case';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { InMemoryTaskRepository } from '../../../../../testing/fakes';

const seedTask = () =>
  Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('Viejo'), createdAt: 1 });

describe('RenameTaskUseCase', () => {
  it('renombra una tarea existente con un título válido', async () => {
    const repo = new InMemoryTaskRepository([seedTask()]);
    const uc = new RenameTaskUseCase(repo);

    const result = await uc.execute(TaskId.of('t1'), '  Nuevo  ');

    expect(result.ok).toBeTrue();
    expect((await repo.findById(TaskId.of('t1')))?.title as string).toBe('Nuevo');
  });

  it('rechaza un título inválido y no cambia la tarea', async () => {
    const repo = new InMemoryTaskRepository([seedTask()]);
    const uc = new RenameTaskUseCase(repo);

    const result = await uc.execute(TaskId.of('t1'), '   ');

    expect(result.ok).toBeFalse();
    expect((await repo.findById(TaskId.of('t1')))?.title as string).toBe('Viejo');
  });

  it('con id inexistente devuelve ok sin lanzar', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new RenameTaskUseCase(repo);

    const result = await uc.execute(TaskId.of('missing'), 'Hola');

    expect(result.ok).toBeTrue();
  });
});
