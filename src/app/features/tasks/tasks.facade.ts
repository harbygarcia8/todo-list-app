import { Injectable, computed, inject, signal } from '@angular/core';

import { Category } from '../../core/domain/category/category.entity';
import { CategoryId } from '../../core/domain/category/category-id';
import { Task } from '../../core/domain/task/task.entity';
import { TaskId } from '../../core/domain/task/task-id';

import { AddTaskUseCase } from '../../core/application/use-cases/task/add-task.use-case';
import { AssignCategoryToTaskUseCase } from '../../core/application/use-cases/task/assign-category-to-task.use-case';
import { DeleteTaskUseCase } from '../../core/application/use-cases/task/delete-task.use-case';
import { ListTasksUseCase } from '../../core/application/use-cases/task/list-tasks.use-case';
import { RenameTaskUseCase } from '../../core/application/use-cases/task/rename-task.use-case';
import { ToggleTaskUseCase } from '../../core/application/use-cases/task/toggle-task.use-case';
import { CreateCategoryUseCase } from '../../core/application/use-cases/category/create-category.use-case';
import { DeleteCategoryUseCase } from '../../core/application/use-cases/category/delete-category.use-case';
import { EditCategoryUseCase } from '../../core/application/use-cases/category/edit-category.use-case';
import { ListCategoriesUseCase } from '../../core/application/use-cases/category/list-categories.use-case';
import { FeatureFlag } from '../../core/application/ports/feature-flag.provider';
import { FEATURE_FLAG_PROVIDER } from '../../core/infrastructure/di/tokens';

/** Valores especiales del filtro por categoría. */
export const ALL_FILTER = 'all';
export const UNCATEGORIZED_FILTER = 'uncategorized';
export type CategoryFilter = typeof ALL_FILTER | typeof UNCATEGORIZED_FILTER | CategoryId;

/**
 * Facade de presentación (adaptador primario).
 *
 * Expone el estado como Signals de solo lectura y traduce las acciones de la UI
 * en llamadas a los casos de uso. Tras cada mutación recarga desde el
 * repositorio (fuente de verdad), manteniendo la vista coherente con `OnPush`.
 */
@Injectable({ providedIn: 'root' })
export class TasksFacade {
  // Casos de uso (inyectados desde la composition root)
  private readonly addTaskUC = inject(AddTaskUseCase);
  private readonly toggleTaskUC = inject(ToggleTaskUseCase);
  private readonly deleteTaskUC = inject(DeleteTaskUseCase);
  private readonly renameTaskUC = inject(RenameTaskUseCase);
  private readonly assignCategoryUC = inject(AssignCategoryToTaskUseCase);
  private readonly listTasksUC = inject(ListTasksUseCase);
  private readonly createCategoryUC = inject(CreateCategoryUseCase);
  private readonly editCategoryUC = inject(EditCategoryUseCase);
  private readonly deleteCategoryUC = inject(DeleteCategoryUseCase);
  private readonly listCategoriesUC = inject(ListCategoriesUseCase);
  private readonly flags = inject(FEATURE_FLAG_PROVIDER);

  // Estado interno
  private readonly _tasks = signal<readonly Task[]>([]);
  private readonly _categories = signal<readonly Category[]>([]);
  private readonly _filter = signal<CategoryFilter>(ALL_FILTER);
  private readonly _loaded = signal(false);
  private readonly _categoriesEnabled = signal(true);

  // Estado derivado (solo lectura)
  readonly loaded = this._loaded.asReadonly();
  readonly filter = this._filter.asReadonly();

  /** Feature flag: ¿está activa la funcionalidad de categorías? (Remote Config) */
  readonly categoriesEnabled = this._categoriesEnabled.asReadonly();

  /** Tareas ordenadas por fecha de creación (desc). */
  readonly tasks = computed(() =>
    [...this._tasks()].sort((a, b) => b.createdAt - a.createdAt),
  );

  /** Categorías ordenadas alfabéticamente. */
  readonly categories = computed(() =>
    [...this._categories()].sort((a, b) => a.name.localeCompare(b.name)),
  );

  /** Índice id → Category para lecturas O(1) desde la plantilla. */
  readonly categoryById = computed(() => {
    const map = new Map<string, Category>();
    for (const category of this._categories()) {
      map.set(category.id, category);
    }
    return map;
  });

  /** Tareas visibles según el filtro activo (si el flag está off, se ven todas). */
  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    if (!this._categoriesEnabled()) {
      return tasks;
    }
    const filter = this._filter();
    if (filter === ALL_FILTER) {
      return tasks;
    }
    if (filter === UNCATEGORIZED_FILTER) {
      return tasks.filter((task) => task.categoryId === null);
    }
    return tasks.filter((task) => task.categoryId === filter);
  });

  /** Métricas agregadas para la cabecera. */
  readonly stats = computed(() => {
    const tasks = this._tasks();
    const completed = tasks.filter((task) => task.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  });

  constructor() {
    void this.init();
  }

  /** Carga inicial del estado desde el repositorio + feature flags. */
  async init(): Promise<void> {
    await this.reloadAll();
    this._categoriesEnabled.set(this.flags.isEnabled(FeatureFlag.CategoriesEnabled));
    this._loaded.set(true);
  }

  /** Vuelve a leer los feature flags desde Remote Config (para la demo en caliente). */
  async refreshFlags(): Promise<void> {
    await this.flags.refresh();
    this._categoriesEnabled.set(this.flags.isEnabled(FeatureFlag.CategoriesEnabled));
  }

  // ── Acciones de tareas ────────────────────────────────────────────────────

  addTask(title: string, categoryId: CategoryId | null = null) {
    return this.addTaskUC
      .execute({ title, categoryId })
      .then((result) => this.after(result, () => this.reloadTasks()));
  }

  async toggleTask(id: TaskId): Promise<void> {
    await this.toggleTaskUC.execute(id);
    await this.reloadTasks();
  }

  async deleteTask(id: TaskId): Promise<void> {
    await this.deleteTaskUC.execute(id);
    await this.reloadTasks();
  }

  renameTask(id: TaskId, title: string) {
    return this.renameTaskUC
      .execute(id, title)
      .then((result) => this.after(result, () => this.reloadTasks()));
  }

  async assignCategory(taskId: TaskId, categoryId: CategoryId | null): Promise<void> {
    await this.assignCategoryUC.execute(taskId, categoryId);
    await this.reloadTasks();
  }

  // ── Acciones de categorías ────────────────────────────────────────────────

  createCategory(name: string, color: string) {
    return this.createCategoryUC
      .execute({ name, color })
      .then((result) => this.after(result, () => this.reloadCategories()));
  }

  editCategory(id: CategoryId, input: { name?: string; color?: string }) {
    return this.editCategoryUC
      .execute(id, input)
      .then((result) => this.after(result, () => this.reloadCategories()));
  }

  async deleteCategory(id: CategoryId): Promise<void> {
    await this.deleteCategoryUC.execute(id);
    await Promise.all([this.reloadCategories(), this.reloadTasks()]);
    if (this._filter() === id) {
      this._filter.set(ALL_FILTER);
    }
  }

  // ── Filtro ────────────────────────────────────────────────────────────────

  setFilter(filter: CategoryFilter): void {
    this._filter.set(filter);
  }

  /** Resuelve la categoría de una tarea (o `undefined`). */
  categoryOf(task: Task): Category | undefined {
    return task.categoryId ? this.categoryById().get(task.categoryId) : undefined;
  }

  // ── Internos ──────────────────────────────────────────────────────────────

  private async reloadAll(): Promise<void> {
    const [tasks, categories] = await Promise.all([
      this.listTasksUC.execute(),
      this.listCategoriesUC.execute(),
    ]);
    this._tasks.set(tasks);
    this._categories.set(categories);
  }

  private async reloadTasks(): Promise<void> {
    this._tasks.set(await this.listTasksUC.execute());
  }

  private async reloadCategories(): Promise<void> {
    this._categories.set(await this.listCategoriesUC.execute());
  }

  /** Ejecuta el efecto secundario solo si el Result fue exitoso; devuelve el Result. */
  private async after<T, E>(
    result: { ok: true; value: T } | { ok: false; error: E },
    onOk: () => Promise<void>,
  ): Promise<{ ok: true; value: T } | { ok: false; error: E }> {
    if (result.ok) {
      await onOk();
    }
    return result;
  }
}
