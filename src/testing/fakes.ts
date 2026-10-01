
import { Task } from '../app/core/domain/task/task.entity';
import { TaskId } from '../app/core/domain/task/task-id';
import { Category } from '../app/core/domain/category/category.entity';
import { CategoryId } from '../app/core/domain/category/category-id';
import { TaskRepository } from '../app/core/application/ports/task-repository.port';
import { CategoryRepository } from '../app/core/application/ports/category-repository.port';
import { IdGenerator } from '../app/core/application/ports/id-generator.port';
import { Clock } from '../app/core/application/ports/clock.port';
import {
  FeatureFlagKey,
  FeatureFlagProvider,
} from '../app/core/application/ports/feature-flag.provider';

export class InMemoryTaskRepository implements TaskRepository {
  private readonly store = new Map<string, Task>();

  constructor(seed: readonly Task[] = []) {
    for (const task of seed) {
      this.store.set(task.id, task);
    }
  }

  async findAll(): Promise<readonly Task[]> {
    return [...this.store.values()];
  }

  async findById(id: TaskId): Promise<Task | null> {
    return this.store.get(id) ?? null;
  }

  async save(task: Task): Promise<void> {
    this.store.set(task.id, task);
  }

  async delete(id: TaskId): Promise<void> {
    this.store.delete(id);
  }
}

export class InMemoryCategoryRepository implements CategoryRepository {
  private readonly store = new Map<string, Category>();

  constructor(seed: readonly Category[] = []) {
    for (const category of seed) {
      this.store.set(category.id, category);
    }
  }

  async findAll(): Promise<readonly Category[]> {
    return [...this.store.values()];
  }

  async findById(id: CategoryId): Promise<Category | null> {
    return this.store.get(id) ?? null;
  }

  async save(category: Category): Promise<void> {
    this.store.set(category.id, category);
  }

  async delete(id: CategoryId): Promise<void> {
    this.store.delete(id);
  }
}

export class FixedIdGenerator implements IdGenerator {
  private index = 0;

  constructor(private readonly ids: readonly string[] = []) {}

  generate(): string {
    const next = this.ids[this.index] ?? `id-${this.index + 1}`;
    this.index += 1;
    return next;
  }
}

export class FixedClock implements Clock {
  constructor(private value = 1_000) {}

  now(): number {
    return this.value;
  }

  set(value: number): void {
    this.value = value;
  }
}

export class FakeFeatureFlagProvider implements FeatureFlagProvider {
  constructor(private readonly flags: Record<string, boolean> = {}) {}

  async initialize(): Promise<void> {
    /* no-op */
  }

  async refresh(): Promise<void> {
    /* no-op */
  }

  isEnabled(flag: FeatureFlagKey): boolean {
    return this.flags[flag] ?? false;
  }

  set(flag: FeatureFlagKey, value: boolean): void {
    this.flags[flag] = value;
  }
}

/** Fachada de almacenamiento en memoria (misma API que StorageService). */
export class FakeStorageService {
  private readonly map = new Map<string, unknown>();

  async get<T>(key: string, fallback: T): Promise<T> {
    return (this.map.has(key) ? this.map.get(key) : fallback) as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.map.set(key, value);
  }
}
