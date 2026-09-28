import { InjectionToken } from '@angular/core';
import { Clock } from '../../application/ports/clock.port';
import { CategoryRepository } from '../../application/ports/category-repository.port';
import { IdGenerator } from '../../application/ports/id-generator.port';
import { TaskRepository } from '../../application/ports/task-repository.port';

/**
 * Tokens de inyección para los PUERTOS.
 *
 * Como los puertos son interfaces (no existen en runtime), necesitamos un token
 * para que Angular pueda inyectarlos. Aquí se define el "contrato"; en
 * `core.providers.ts` se enlaza cada token con su adaptador concreto.
 */
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TaskRepository');
export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>('CategoryRepository');
export const ID_GENERATOR = new InjectionToken<IdGenerator>('IdGenerator');
export const CLOCK = new InjectionToken<Clock>('Clock');
