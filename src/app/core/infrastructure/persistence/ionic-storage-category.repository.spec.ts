import { TestBed } from '@angular/core/testing';
import { IonicStorageCategoryRepository } from './ionic-storage-category.repository';
import { StorageService } from './storage.service';
import { FakeStorageService } from '../../../../testing/fakes';
import { Category } from '../../domain/category/category.entity';
import { CategoryId } from '../../domain/category/category-id';
import { CategoryName } from '../../domain/category/category-name.vo';
import { CategoryColor } from '../../domain/category/category-color.vo';

const category = (id: string, name = 'Trabajo', color = '#3880ff') =>
  Category.fromProps({
    id: CategoryId.of(id),
    name: CategoryName.of(name),
    color: CategoryColor.of(color),
    createdAt: 1,
  });

describe('IonicStorageCategoryRepository', () => {
  let repo: IonicStorageCategoryRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IonicStorageCategoryRepository,
        { provide: StorageService, useClass: FakeStorageService },
      ],
    });
    repo = TestBed.inject(IonicStorageCategoryRepository);
  });

  it('save + findAll hacen round-trip entidad↔DTO', async () => {
    await repo.save(category('c1'));
    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0].id as string).toBe('c1');
    expect(all[0].name as string).toBe('Trabajo');
    expect(all[0].color as string).toBe('#3880ff');
  });

  it('findById devuelve la categoría o null', async () => {
    await repo.save(category('c1'));
    expect((await repo.findById(CategoryId.of('c1')))?.id as string).toBe('c1');
    expect(await repo.findById(CategoryId.of('nope'))).toBeNull();
  });

  it('save actualiza cuando el id ya existe (upsert)', async () => {
    await repo.save(category('c1', 'Trabajo'));
    await repo.save(category('c1', 'Personal'));
    const all = await repo.findAll();
    expect(all.length).toBe(1);
    expect(all[0].name as string).toBe('Personal');
  });

  it('delete elimina por id', async () => {
    await repo.save(category('c1'));
    await repo.delete(CategoryId.of('c1'));
    expect((await repo.findAll()).length).toBe(0);
  });
});
