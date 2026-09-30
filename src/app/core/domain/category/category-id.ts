import { Branded } from '../shared/branded';

export type CategoryId = Branded<string, 'CategoryId'>;

export const CategoryId = {
  of(value: string): CategoryId {
    return value as CategoryId;
  },
};
