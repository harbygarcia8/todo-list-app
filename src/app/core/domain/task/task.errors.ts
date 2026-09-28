/** El título de la tarea llegó vacío (o solo con espacios). */
export class EmptyTaskTitleError {
  readonly kind = 'EmptyTaskTitle' as const;
  readonly message = 'El título de la tarea no puede estar vacío.';
}

/** El título excede la longitud máxima permitida. */
export class TaskTitleTooLongError {
  readonly kind = 'TaskTitleTooLong' as const;
  constructor(readonly max: number) {}
  get message(): string {
    return `El título no puede superar los ${this.max} caracteres.`;
  }
}

/** Unión de errores posibles al construir un TaskTitle. */
export type TaskTitleError = EmptyTaskTitleError | TaskTitleTooLongError;
