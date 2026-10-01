import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

/** Doble mínimo de `@ionic/storage-angular` en memoria. */
class FakeIonicStorage {
  private readonly map = new Map<string, unknown>();
  async create(): Promise<unknown> {
    return this;
  }
  async get(key: string): Promise<unknown> {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  async set(key: string, value: unknown): Promise<void> {
    this.map.set(key, value);
  }
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, { provide: Storage, useClass: FakeIonicStorage }],
    });
    service = TestBed.inject(StorageService);
  });

  it('devuelve el fallback cuando la clave no existe', async () => {
    expect(await service.get('ausente', 'default')).toBe('default');
  });

  it('persiste y recupera un valor', async () => {
    await service.set('k', { a: 1 });
    expect(await service.get<{ a: number }>('k', { a: 0 })).toEqual({ a: 1 });
  });
});
