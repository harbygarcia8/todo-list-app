import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage);
  private readonly ready: Promise<void> = this.init();

  private async init(): Promise<void> {
    await this.storage.create();
  }

  async get<T>(key: string, fallback: T): Promise<T> {
    await this.ready;
    const value = await this.storage.get(key);
    return (value ?? fallback) as T;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ready;
    await this.storage.set(key, value);
  }
}
