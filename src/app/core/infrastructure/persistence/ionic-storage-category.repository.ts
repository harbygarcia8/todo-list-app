import { Injectable, inject } from '@angular/core';
import { CategoryColor } from '../../domain/category/category-color.vo';
import { CategoryId } from '../../domain/category/category-id';
import { CategoryName } from '../../domain/category/category-name.vo';
import { Category } from '../../domain/category/category.entity';
import { CategoryRepository } from '../../application/ports/category-repository.port';
import { StorageService } from './storage.service';
import { CategoryDTO } from './category.dto';

const STORAGE_KEY = 'todo.categories';

/** Adaptador de {@link CategoryRepository} sobre {@link StorageService}. */
@Injectable({ providedIn: 'root' })
export class IonicStorageCategoryRepository implements CategoryRepository {
  private readonly storage = inject(StorageService);

  async findAll(): Promise<readonly Category[]> {
    const dtos = await this.storage.get<CategoryDTO[]>(STORAGE_KEY, []);
    return dtos.map(toEntity);
  }

  async findById(id: CategoryId): Promise<Category | null> {
    const all = await this.findAll();
    return all.find((category) => category.id === id) ?? null;
  }

  async save(category: Category): Promise<void> {
    const all = [...(await this.findAll())];
    const index = all.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      all[index] = category;
    } else {
      all.push(category);
    }
    await this.persist(all);
  }

  async delete(id: CategoryId): Promise<void> {
    const remaining = (await this.findAll()).filter((category) => category.id !== id);
    await this.persist(remaining);
  }

  private persist(categories: readonly Category[]): Promise<void> {
    return this.storage.set(STORAGE_KEY, categories.map(toDTO));
  }
}

function toDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    color: category.color,
    createdAt: category.createdAt,
  };
}

function toEntity(dto: CategoryDTO): Category {
  return Category.fromProps({
    id: CategoryId.of(dto.id),
    name: CategoryName.of(dto.name),
    color: CategoryColor.of(dto.color),
    createdAt: dto.createdAt,
  });
}
