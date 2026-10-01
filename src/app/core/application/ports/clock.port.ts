/**
 * Puerto para obtener el tiempo actual.
 *
 * Abstraer `Date.now()` hace que los casos de uso que dependen del tiempo
 * (createdAt) sean deterministas y testeables.
 */
export interface Clock {
  /** Marca de tiempo actual (epoch ms). */
  now(): number;
}
