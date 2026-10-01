import { CryptoIdGenerator } from './crypto-id-generator';

describe('CryptoIdGenerator', () => {
  it('genera un string no vacío', () => {
    const id = new CryptoIdGenerator().generate();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('genera identificadores distintos en llamadas sucesivas', () => {
    const gen = new CryptoIdGenerator();
    expect(gen.generate()).not.toBe(gen.generate());
  });
});
