import { TestBed } from '@angular/core/testing';

import { TasksFacade, ALL_FILTER, UNCATEGORIZED_FILTER } from './tasks.facade';
import { AddTaskUseCase } from '../../core/application/use-cases/task/add-task.use-case';
import { ToggleTaskUseCase } from '../../core/application/use-cases/task/toggle-task.use-case';
import { DeleteTaskUseCase } from '../../core/application/use-cases/task/delete-task.use-case';
import { RenameTaskUseCase } from '../../core/application/use-cases/task/rename-task.use-case';
import { AssignCategoryToTaskUseCase } from '../../core/application/use-cases/task/assign-category-to-task.use-case';
import { ListTasksUseCase } from '../../core/application/use-cases/task/list-tasks.use-case';
import { CreateCategoryUseCase } from '../../core/application/use-cases/category/create-category.use-case';
import { EditCategoryUseCase } from '../../core/application/use-cases/category/edit-category.use-case';
import { DeleteCategoryUseCase } from '../../core/application/use-cases/category/delete-category.use-case';
import { ListCategoriesUseCase } from '../../core/application/use-cases/category/list-categories.use-case';
import { FEATURE_FLAG_PROVIDER } from '../../core/infrastructure/di/tokens';
import {
  FakeFeatureFlagProvider,
  FixedClock,
  FixedIdGenerator,
  InMemoryCategoryRepository,
  InMemoryTaskRepository,
} from '../../../testing/fakes';

function setup(flags: Record<string, boolean> = { categories_enabled: true }) {
  const taskRepo = new InMemoryTaskRepository();
  const catRepo = new InMemoryCategoryRepository();
  const ids = new FixedIdGenerator();
  const clock = new FixedClock(1000);
  const flagProvider = new FakeFeatureFlagProvider(flags);

  TestBed.configureTestingModule({
    providers: [
      { provide: AddTaskUseCase, useValue: new AddTaskUseCase(taskRepo, ids, clock) },
      { provide: ToggleTaskUseCase, useValue: new ToggleTaskUseCase(taskRepo) },
      { provide: DeleteTaskUseCase, useValue: new DeleteTaskUseCase(taskRepo) },
      { provide: RenameTaskUseCase, useValue: new RenameTaskUseCase(taskRepo) },
      {
        provide: AssignCategoryToTaskUseCase,
        useValue: new AssignCategoryToTaskUseCase(taskRepo),
      },
      { provide: ListTasksUseCase, useValue: new ListTasksUseCase(taskRepo) },
      { provide: CreateCategoryUseCase, useValue: new CreateCategoryUseCase(catRepo, ids, clock) },
      { provide: EditCategoryUseCase, useValue: new EditCategoryUseCase(catRepo) },
      { provide: DeleteCategoryUseCase, useValue: new DeleteCategoryUseCase(catRepo, taskRepo) },
      { provide: ListCategoriesUseCase, useValue: new ListCategoriesUseCase(catRepo) },
      { provide: FEATURE_FLAG_PROVIDER, useValue: flagProvider },
      TasksFacade,
    ],
  });

  return { facade: TestBed.inject(TasksFacade), flagProvider, clock };
}

describe('TasksFacade', () => {
  it('addTask agrega la tarea y actualiza las stats', async () => {
    const { facade } = setup();
    await facade.init();

    await facade.addTask('Nueva tarea');

    expect(facade.stats().total).toBe(1);
    expect(facade.stats().pending).toBe(1);
    expect(facade.tasks()[0].title as string).toBe('Nueva tarea');
  });

  it('addTask con título inválido devuelve error y no agrega', async () => {
    const { facade } = setup();
    await facade.init();

    const result = await facade.addTask('   ');

    expect(result.ok).toBeFalse();
    expect(facade.stats().total).toBe(0);
  });

  it('tasks() ordena por fecha de creación descendente', async () => {
    const { facade, clock } = setup();
    await facade.init();

    clock.set(100);
    await facade.addTask('vieja');
    clock.set(200);
    await facade.addTask('nueva');

    expect(facade.tasks()[0].title as string).toBe('nueva');
  });

  it('toggleTask marca la tarea como completada', async () => {
    const { facade } = setup();
    await facade.init();
    await facade.addTask('X');

    await facade.toggleTask(facade.tasks()[0].id);

    expect(facade.stats().completed).toBe(1);
  });

  it('filtra por categoría, sin categoría y todas', async () => {
    const { facade } = setup();
    await facade.init();
    await facade.createCategory('Trabajo', '#3880ff');
    const catId = facade.categories()[0].id;
    await facade.addTask('con categoría', catId);
    await facade.addTask('sin categoría', null);

    facade.setFilter(catId);
    expect(facade.filteredTasks().length).toBe(1);

    facade.setFilter(UNCATEGORIZED_FILTER);
    expect(facade.filteredTasks().length).toBe(1);

    facade.setFilter(ALL_FILTER);
    expect(facade.filteredTasks().length).toBe(2);
  });

  it('con el feature flag OFF ignora el filtro (muestra todas)', async () => {
    const { facade } = setup({ categories_enabled: false });
    await facade.init();
    expect(facade.categoriesEnabled()).toBeFalse();

    await facade.addTask('a');
    await facade.addTask('b');
    facade.setFilter(UNCATEGORIZED_FILTER);

    expect(facade.filteredTasks().length).toBe(2);
  });

  it('refreshFlags actualiza categoriesEnabled desde el proveedor', async () => {
    const { facade, flagProvider } = setup({ categories_enabled: true });
    await facade.init();
    expect(facade.categoriesEnabled()).toBeTrue();

    flagProvider.set('categories_enabled', false);
    await facade.refreshFlags();

    expect(facade.categoriesEnabled()).toBeFalse();
  });

  it('deleteCategory elimina, desasigna tareas en cascada y resetea el filtro', async () => {
    const { facade } = setup();
    await facade.init();
    await facade.createCategory('Trabajo', '#3880ff');
    const catId = facade.categories()[0].id;
    await facade.addTask('con categoría', catId);
    facade.setFilter(catId);

    await facade.deleteCategory(catId);

    expect(facade.categories().length).toBe(0);
    expect(facade.filter()).toBe(ALL_FILTER);
    expect(facade.tasks()[0].categoryId).toBeNull();
  });

  it('categoryOf resuelve la categoría de una tarea', async () => {
    const { facade } = setup();
    await facade.init();
    await facade.createCategory('Trabajo', '#3880ff');
    const catId = facade.categories()[0].id;
    await facade.addTask('x', catId);

    expect(facade.categoryOf(facade.tasks()[0])?.id).toBe(catId);
  });
});
