import { Branded } from '../shared/branded';

/** Identificador único de una tarea (branded para no confundirlo con otros IDs). */
export type TaskId = Branded<string, 'TaskId'>;

export const TaskId = {
  /**
   * Envuelve un string existente como TaskId (p.ej. al reconstruir desde
   * persistencia). La generación de nuevos IDs vive en un puerto de la capa
   * de aplicación, no aquí (el dominio no conoce `crypto`).
   */
  of(value: string): TaskId {
    return value as TaskId;
  },
};
