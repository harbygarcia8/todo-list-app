declare const __brand: unique symbol;

/**
 * Branded<T, B>: un tipo "marcado". En runtime es el primitivo `T` (p.ej. string),
 * pero en compilación distingue conceptos: un `TaskId` NO es asignable a un
 * `CategoryId` aunque ambos sean strings. Previene bugs de mezcla de identificadores,
 * con cero costo en runtime.
 */
export type Branded<T, B extends string> = T & { readonly [__brand]: B };
