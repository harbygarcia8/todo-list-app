import { AddTaskUseCase } from './add-task.use-case';
import { CategoryId } from '../../../domain/category/category-id';
import {
  FixedClock,
  FixedIdGenerator,
  InMemoryTaskRepository,
} from '../../../../../testing/fakes';

describe('AddTaskUseCase', () => {
  it('crea y persiste una tarea válida con id y fecha inyectados', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new AddTaskUseCase(repo, new FixedIdGenerator(['t1']), new FixedClock(500));

    const result = await uc.execute({ title: '  Comprar pan  ' });

    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.value.id as string).toBe('t1');
      expect(result.value.title as string).toBe('Comprar pan');
      expect(result.value.completed).toBeFalse();
      expect(result.value.createdAt).toBe(500);
    }
    expect((await repo.findAll()).length).toBe(1);
  });

  it('asigna la categoría cuando se proporciona', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new AddTaskUseCase(repo, new FixedIdGenerator(['t1']), new FixedClock());

    const result = await uc.execute({ title: 'X', categoryId: CategoryId.of('c1') });

    if (result.ok) {
      expect(result.value.categoryId as string).toBe('c1');
    }
  });

  it('rechaza un título inválido y NO persiste nada', async () => {
    const repo = new InMemoryTaskRepository();
    const uc = new AddTaskUseCase(repo, new FixedIdGenerator(['t1']), new FixedClock());

    const result = await uc.execute({ title: '   ' });

    expect(result.ok).toBeFalse();
    if (!result.ok) {
      expect(result.error.kind).toBe('EmptyTaskTitle');
    }
    expect((await repo.findAll()).length).toBe(0);
  });
});
