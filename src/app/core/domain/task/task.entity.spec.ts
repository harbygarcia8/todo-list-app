import { Task } from './task.entity';
import { TaskId } from './task-id';
import { TaskTitle } from './task-title.vo';
import { CategoryId } from '../category/category-id';

const newTask = (overrides?: { categoryId?: CategoryId | null }) =>
  Task.create({
    id: TaskId.of('t1'),
    title: TaskTitle.of('Tarea'),
    categoryId: overrides?.categoryId,
    createdAt: 1000,
  });

describe('Task (entidad)', () => {
  it('create() inicia pendiente y sin categoría por defecto', () => {
    const task = newTask();
    expect(task.id as string).toBe('t1');
    expect(task.completed).toBeFalse();
    expect(task.categoryId).toBeNull();
    expect(task.createdAt).toBe(1000);
  });

  it('create() acepta categoría inicial', () => {
    const task = newTask({ categoryId: CategoryId.of('c1') });
    expect(task.categoryId as string).toBe('c1');
  });

  it('toggle() alterna completado devolviendo una NUEVA instancia (inmutable)', () => {
    const task = newTask();
    const toggled = task.toggle();
    expect(toggled).not.toBe(task); // inmutabilidad
    expect(toggled.completed).toBeTrue();
    expect(task.completed).toBeFalse(); // la original no cambia
    expect(toggled.toggle().completed).toBeFalse();
  });

  it('rename() cambia el título sin mutar la original', () => {
    const task = newTask();
    const renamed = task.rename(TaskTitle.of('Nuevo'));
    expect(renamed.title as string).toBe('Nuevo');
    expect(task.title as string).toBe('Tarea');
  });

  it('assignCategory() asigna y desasigna con null', () => {
    const task = newTask();
    const assigned = task.assignCategory(CategoryId.of('c9'));
    expect(assigned.categoryId as string).toBe('c9');
    expect(assigned.assignCategory(null).categoryId).toBeNull();
  });

  it('fromProps() + snapshot() hacen round-trip del estado', () => {
    const props = newTask().snapshot();
    const rebuilt = Task.fromProps(props);
    expect(rebuilt.snapshot()).toEqual(props);
  });
});
