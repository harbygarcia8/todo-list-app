import { DeleteCategoryUseCase } from './delete-category.use-case';
import { Category } from '../../../domain/category/category.entity';
import { CategoryId } from '../../../domain/category/category-id';
import { CategoryName } from '../../../domain/category/category-name.vo';
import { CategoryColor } from '../../../domain/category/category-color.vo';
import { Task } from '../../../domain/task/task.entity';
import { TaskId } from '../../../domain/task/task-id';
import { TaskTitle } from '../../../domain/task/task-title.vo';
import {
  InMemoryCategoryRepository,
  InMemoryTaskRepository,
} from '../../../../../testing/fakes';

const category = () =>
  Category.create({
    id: CategoryId.of('c1'),
    name: CategoryName.of('Trabajo'),
    color: CategoryColor.of('#3880ff'),
    createdAt: 1,
  });

const taskIn = (id: string, categoryId: CategoryId | null) =>
  Task.fromProps({
    id: TaskId.of(id),
    title: TaskTitle.of('X'),
    completed: false,
    categoryId,
    createdAt: 1,
  });

describe('DeleteCategoryUseCase', () => {
  it('elimina la categoría y desasigna EN CASCADA las tareas afectadas', async () => {
    const catRepo = new InMemoryCategoryRepository([category()]);
    const taskRepo = new InMemoryTaskRepository([
      taskIn('t1', CategoryId.of('c1')),
      taskIn('t2', CategoryId.of('c1')),
      taskIn('t3', CategoryId.of('c2')), // otra categoría, no debe tocarse
    ]);
    const uc = new DeleteCategoryUseCase(catRepo, taskRepo);

    await uc.execute(CategoryId.of('c1'));

    expect(await catRepo.findById(CategoryId.of('c1'))).toBeNull();
    expect((await taskRepo.findById(TaskId.of('t1')))?.categoryId).toBeNull();
    expect((await taskRepo.findById(TaskId.of('t2')))?.categoryId).toBeNull();
    // Las de otra categoría se conservan intactas.
    expect((await taskRepo.findById(TaskId.of('t3')))?.categoryId as string).toBe('c2');
  });
});
