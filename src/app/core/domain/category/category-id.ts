import { Branded } from '../shared/branded';

/** Identificador único de una categoría (branded). */
export type CategoryId = Branded<string, 'CategoryId'>;

export const CategoryId = {
  /** Envuelve un string existente como CategoryId (reconstrucción desde persistencia). */
  of(value: string): CategoryId {
    return value as CategoryId;
  },
};
