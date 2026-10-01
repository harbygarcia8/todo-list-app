import { FirebaseRemoteConfigProvider } from './firebase-remote-config.provider';
import { FeatureFlag } from '../../application/ports/feature-flag.provider';

describe('FirebaseRemoteConfigProvider', () => {
  it('antes de inicializar, isEnabled devuelve false (sin caché) y no está remoto', () => {
    const provider = new FirebaseRemoteConfigProvider();
    expect(provider.isEnabled(FeatureFlag.CategoriesEnabled)).toBeFalse();
    expect(provider.isRemoteActive()).toBeFalse();
  });

  it('refresh() sin inicializar es un no-op seguro', async () => {
    const provider = new FirebaseRemoteConfigProvider();
    await expectAsync(provider.refresh()).toBeResolved();
  });
});
