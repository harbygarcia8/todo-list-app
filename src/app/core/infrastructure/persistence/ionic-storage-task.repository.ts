import { Injectable, inject } from '@angular/core';
import { CategoryId } from '../../domain/category/category-id';
import { TaskId } from '../../domain/task/task-id';
import { TaskTitle } from '../../domain/task/task-title.vo';
import { Task } from '../../domain/task/task.entity';
import { TaskRepository } from '../../application/ports/task-repository.port';
import { StorageService } from './storage.service';
import { TaskDTO } from './task.dto';

const STORAGE_KEY = 'todo.tasks';

/** Adaptador de {@link TaskRepository} sobre {@link StorageService} (IndexedDB). */
@Injectable({ providedIn: 'root' })
export class IonicStorageTaskRepository implements TaskRepository {
  private readonly storage = inject(StorageService);

  async findAll(): Promise<readonly Task[]> {
    const dtos = await this.storage.get<TaskDTO[]>(STORAGE_KEY, []);
    return dtos.map(toEntity);
  }

  async findById(id: TaskId): Promise<Task | null> {
    const all = await this.findAll();
    return all.find((task) => task.id === id) ?? null;
  }

  async save(task: Task): Promise<void> {
    const all = [...(await this.findAll())];
    const index = all.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      all[index] = task;
    } else {
      all.unshift(task);
    }
    await this.persist(all);
  }

  async delete(id: TaskId): Promise<void> {
    const remaining = (await this.findAll()).filter((task) => task.id !== id);
    await this.persist(remaining);
  }

  private persist(tasks: readonly Task[]): Promise<void> {
    return this.storage.set(STORAGE_KEY, tasks.map(toDTO));
  }
}

/** Entidad → DTO (para guardar). */
function toDTO(task: Task): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    categoryId: task.categoryId,
    createdAt: task.createdAt,
  };
}

/** DTO → Entidad (al leer; se confía en datos ya validados). */
function toEntity(dto: TaskDTO): Task {
  return Task.fromProps({
    id: TaskId.of(dto.id),
    title: TaskTitle.of(dto.title),
    completed: dto.completed,
    categoryId: dto.categoryId ? CategoryId.of(dto.categoryId) : null,
    createdAt: dto.createdAt,
  });
}
