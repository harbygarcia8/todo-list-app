import { AssignCategoryToTaskUseCase } from './assign-category-to-task.use-case';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import { CategoryId } from '../../../domain/category/category-id';
import { InMemoryTaskRepository } from '../../../../../testing/fakes';

const seedTask = () =>
  Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('X'), createdAt: 1 });

describe('AssignCategoryToTaskUseCase', () => {
  it('asigna una categoría a la tarea', async () => {
    const repo = new InMemoryTaskRepository([seedTask()]);
    const uc = new AssignCategoryToTaskUseCase(repo);

    await uc.execute(TaskId.of('t1'), CategoryId.of('c1'));

    expect((await repo.findById(TaskId.of('t1')))?.categoryId as string).toBe('c1');
  });

  it('desasigna la categoría con null', async () => {
    const withCat = seedTask().assignCategory(CategoryId.of('c1'));
    const repo = new InMemoryTaskRepository([withCat]);
    const uc = new AssignCategoryToTaskUseCase(repo);

    await uc.execute(TaskId.of('t1'), null);

    expect((await repo.findById(TaskId.of('t1')))?.categoryId).toBeNull();
  });

  it('es no-op si la tarea no existe', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new AssignCategoryToTaskUseCase(repo);

    await expectAsync(uc.execute(TaskId.of('missing'), CategoryId.of('c1'))).toBeResolved();
  });
});
