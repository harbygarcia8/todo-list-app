import { Branded } from '../shared/branded';
import { Result, ok, err } from '../shared/result';
import {
  EmptyTaskTitleError,
  TaskTitleError,
  TaskTitleTooLongError,
} from './task.errors';

/** Value Object: un título de tarea válido (no vacío, longitud acotada). */
export type TaskTitle = Branded<string, 'TaskTitle'>;

const MAX_LENGTH = 200;

export const TaskTitle = {
  /** Crea un título validado a partir del texto que escribe el usuario. */
  create(raw: string): Result<TaskTitle, TaskTitleError> {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      return err(new EmptyTaskTitleError());
    }
    if (trimmed.length > MAX_LENGTH) {
      return err(new TaskTitleTooLongError(MAX_LENGTH));
    }
    return ok(trimmed as TaskTitle);
  },

  /** Reconstruye un título ya validado (desde persistencia), sin re-validar. */
  of(value: string): TaskTitle {
    return value as TaskTitle;
  },
};
