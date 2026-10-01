export interface IdGenerator {
  /** Genera un identificador único (p.ej. UUID v4). */
  generate(): string;
}
