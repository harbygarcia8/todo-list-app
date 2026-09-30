
export class EmptyTaskTitleError {
  readonly kind = 'EmptyTaskTitle' as const;
  readonly message = 'El título de la tarea no puede estar vacío.';
}

export class TaskTitleTooLongError {
  readonly kind = 'TaskTitleTooLong' as const;
  constructor(readonly max: number) {}
  get message(): string {
    return `El título no puede superar los ${this.max} caracteres.`;
  }
}

export type TaskTitleError = EmptyTaskTitleError | TaskTitleTooLongError;
