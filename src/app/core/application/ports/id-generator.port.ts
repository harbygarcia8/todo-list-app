/**
 * Puerto para generar identificadores únicos.
 *
 * El dominio no conoce `crypto.randomUUID` (una API de plataforma). Al abstraerlo
 * como puerto, los casos de uso quedan deterministas y testeables (en tests se
 * inyecta un generador fijo).
 */
export interface IdGenerator {
  /** Genera un identificador único (p.ej. UUID v4). */
  generate(): string;
}
