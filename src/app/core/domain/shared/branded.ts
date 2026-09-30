declare const __brand: unique symbol;

export type Branded<T, B extends string> = T & { readonly [__brand]: B };
