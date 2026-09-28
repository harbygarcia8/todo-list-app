import { CategoryId } from '../category/category-id';
import { TaskId } from './task-id';
import { TaskTitle } from './task-title.vo';

/** Estado interno inmutable de una tarea. */
export interface TaskProps {
  readonly id: TaskId;
  readonly title: TaskTitle;
  readonly completed: boolean;
  readonly categoryId: CategoryId | null;
  readonly createdAt: number;
}

/**
 * Entidad Task: encapsula el estado y el comportamiento de una tarea.
 *
 * Es INMUTABLE: cada operación (toggle, rename, assignCategory) devuelve una
 * NUEVA instancia en vez de mutar la actual. Eso hace el estado predecible y
 * encaja perfecto con Signals en la capa de presentación.
 */
export class Task {
  private constructor(private readonly props: TaskProps) {}

  /** Crea una tarea nueva (siempre inicia como pendiente). */
  static create(input: {
    id: TaskId;
    title: TaskTitle;
    categoryId?: CategoryId | null;
    createdAt: number;
  }): Task {
    return new Task({
      id: input.id,
      title: input.title,
      completed: false,
      categoryId: input.categoryId ?? null,
      createdAt: input.createdAt,
    });
  }

  /** Reconstruye una tarea desde sus props (al leer de persistencia). */
  static fromProps(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): TaskId {
    return this.props.id;
  }
  get title(): TaskTitle {
    return this.props.title;
  }
  get completed(): boolean {
    return this.props.completed;
  }
  get categoryId(): CategoryId | null {
    return this.props.categoryId;
  }
  get createdAt(): number {
    return this.props.createdAt;
  }

  /** Alterna entre completada y pendiente. */
  toggle(): Task {
    return new Task({ ...this.props, completed: !this.props.completed });
  }

  /** Cambia el título por otro ya validado. */
  rename(title: TaskTitle): Task {
    return new Task({ ...this.props, title });
  }

  /** Asigna una categoría, o la quita con `null`. */
  assignCategory(categoryId: CategoryId | null): Task {
    return new Task({ ...this.props, categoryId });
  }

  /** Expone las props (para el mapeo en la capa de infraestructura). */
  snapshot(): TaskProps {
    return this.props;
  }
}
