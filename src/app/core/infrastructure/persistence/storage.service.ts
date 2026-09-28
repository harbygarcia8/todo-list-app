import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Fachada sobre `@ionic/storage-angular` (IndexedDB / localStorage).
 *
 * Garantiza que el driver esté inicializado antes de cualquier lectura/escritura
 * mediante una promesa `ready` compartida. Los repositorios la usan como
 * mecanismo de almacenamiento por clave.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage);
  private readonly ready: Promise<void> = this.init();

  private async init(): Promise<void> {
    await this.storage.create();
  }

  /** Lee un valor tipado; devuelve `fallback` si la clave no existe. */
  async get<T>(key: string, fallback: T): Promise<T> {
    await this.ready;
    const value = await this.storage.get(key);
    return (value ?? fallback) as T;
  }

  /** Persiste un valor bajo la clave indicada. */
  async set<T>(key: string, value: T): Promise<void> {
    await this.ready;
    await this.storage.set(key, value);
  }
}
