import { Injectable } from '@angular/core';
import { IdGenerator } from '../../application/ports/id-generator.port';

/** Adaptador de {@link IdGenerator} usando la Web Crypto API (UUID v4). */
@Injectable({ providedIn: 'root' })
export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
