import { Provider, inject } from '@angular/core';

// Puertos (tokens)
import {
  CATEGORY_REPOSITORY,
  CLOCK,
  FEATURE_FLAG_PROVIDER,
  ID_GENERATOR,
  TASK_REPOSITORY,
} from './tokens';

// Adaptadores (implementaciones)
import { IonicStorageCategoryRepository } from '../persistence/ionic-storage-category.repository';
import { IonicStorageTaskRepository } from '../persistence/ionic-storage-task.repository';
import { CryptoIdGenerator } from '../system/crypto-id-generator';
import { SystemClock } from '../system/system-clock';
import { FirebaseRemoteConfigProvider } from '../feature-flags/firebase-remote-config.provider';

// Casos de uso (tareas)
import { AddTaskUseCase } from '../../application/use-cases/task/add-task.use-case';
import { AssignCategoryToTaskUseCase } from '../../application/use-cases/task/assign-category-to-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/task/delete-task.use-case';
import { ListTasksUseCase } from '../../application/use-cases/task/list-tasks.use-case';
import { RenameTaskUseCase } from '../../application/use-cases/task/rename-task.use-case';
import { ToggleTaskUseCase } from '../../application/use-cases/task/toggle-task.use-case';

// Casos de uso (categorías)
import { CreateCategoryUseCase } from '../../application/use-cases/category/create-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/category/delete-category.use-case';
import { EditCategoryUseCase } from '../../application/use-cases/category/edit-category.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/category/list-categories.use-case';

/**
 * Composition root del núcleo hexagonal: enlaza puertos → adaptadores y provee
 * los casos de uso (clases planas) mediante factories que inyectan sus
 * dependencias. Es el único punto donde el dominio "se cablea" a Angular.
 */
export const coreProviders: Provider[] = [
  // Puertos → adaptadores concretos
  { provide: TASK_REPOSITORY, useExisting: IonicStorageTaskRepository },
  { provide: CATEGORY_REPOSITORY, useExisting: IonicStorageCategoryRepository },
  { provide: ID_GENERATOR, useExisting: CryptoIdGenerator },
  { provide: CLOCK, useExisting: SystemClock },
  { provide: FEATURE_FLAG_PROVIDER, useExisting: FirebaseRemoteConfigProvider },

  // Casos de uso — tareas
  {
    provide: AddTaskUseCase,
    useFactory: () => new AddTaskUseCase(inject(TASK_REPOSITORY), inject(ID_GENERATOR), inject(CLOCK)),
  },
  { provide: ToggleTaskUseCase, useFactory: () => new ToggleTaskUseCase(inject(TASK_REPOSITORY)) },
  { provide: DeleteTaskUseCase, useFactory: () => new DeleteTaskUseCase(inject(TASK_REPOSITORY)) },
  { provide: RenameTaskUseCase, useFactory: () => new RenameTaskUseCase(inject(TASK_REPOSITORY)) },
  {
    provide: AssignCategoryToTaskUseCase,
    useFactory: () => new AssignCategoryToTaskUseCase(inject(TASK_REPOSITORY)),
  },
  { provide: ListTasksUseCase, useFactory: () => new ListTasksUseCase(inject(TASK_REPOSITORY)) },

  // Casos de uso — categorías
  {
    provide: CreateCategoryUseCase,
    useFactory: () =>
      new CreateCategoryUseCase(inject(CATEGORY_REPOSITORY), inject(ID_GENERATOR), inject(CLOCK)),
  },
  { provide: EditCategoryUseCase, useFactory: () => new EditCategoryUseCase(inject(CATEGORY_REPOSITORY)) },
  {
    provide: DeleteCategoryUseCase,
    useFactory: () => new DeleteCategoryUseCase(inject(CATEGORY_REPOSITORY), inject(TASK_REPOSITORY)),
  },
  {
    provide: ListCategoriesUseCase,
    useFactory: () => new ListCategoriesUseCase(inject(CATEGORY_REPOSITORY)),
  },
];
