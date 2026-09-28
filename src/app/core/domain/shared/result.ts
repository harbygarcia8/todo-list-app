/**
 * Result<T, E>: el resultado de una operación que puede fallar, SIN excepciones.
 *
 * Obliga a manejar el error de forma explícita: el compilador no te deja leer
 * `.value` sin antes comprobar `ok === true`. Errores como valores → flujo
 * predecible y fácil de testear.
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/** Construye un resultado exitoso. */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/** Construye un resultado fallido. */
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/** Type guard: estrecha a la rama exitosa. */
export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; value: T } => r.ok;

/** Type guard: estrecha a la rama fallida. */
export const isErr = <T, E>(r: Result<T, E>): r is { ok: false; error: E } => !r.ok;
