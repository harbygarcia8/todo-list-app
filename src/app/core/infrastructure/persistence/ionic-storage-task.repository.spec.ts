import { TestBed } from '@angular/core/testing';
import { IonicStorageTaskRepository } from './ionic-storage-task.repository';
import { StorageService } from './storage.service';
import { FakeStorageService } from '../../../../testing/fakes';
import { Task } from '../../domain/task/task.entity';
import { TaskId } from '../../domain/task/task-id';
import { TaskTitle } from '../../domain/task/task-title.vo';
import { CategoryId } from '../../domain/category/category-id';

const task = (id: string, categoryId: CategoryId | null = null) =>
  Task.fromProps({
    id: TaskId.of(id),
    title: TaskTitle.of(`T-${id}`),
    completed: false,
    categoryId,
    createdAt: 1,
  });

describe('IonicStorageTaskRepository', () => {
  let repo: IonicStorageTaskRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IonicStorageTaskRepository,
        { provide: StorageService, useClass: FakeStorageService },
      ],
    });
    repo = TestBed.inject(IonicStorageTaskRepository);
  });

  it('save + findAll hacen round-trip entidad↔DTO (incluida la categoría)', async () => {
    await repo.save(task('t1', CategoryId.of('c1')));
    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0].id as string).toBe('t1');
    expect(all[0].title as string).toBe('T-t1');
    expect(all[0].categoryId as string).toBe('c1');
  });

  it('preserva categoryId null en el round-trip', async () => {
    await repo.save(task('t1', null));
    expect((await repo.findAll())[0].categoryId).toBeNull();
  });

  it('findById devuelve la tarea o null', async () => {
    await repo.save(task('t1'));
    expect((await repo.findById(TaskId.of('t1')))?.id as string).toBe('t1');
    expect(await repo.findById(TaskId.of('nope'))).toBeNull();
  });

  it('save actualiza cuando el id ya existe (upsert)', async () => {
    await repo.save(task('t1'));
    await repo.save(task('t1').toggle());
    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0].completed).toBeTrue();
  });

  it('delete elimina por id', async () => {
    await repo.save(task('t1'));
    await repo.delete(TaskId.of('t1'));
    expect((await repo.findAll()).length).toBe(0);
  });
});
