import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('ion-palette-dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('ion-palette-dark');
  });

  it('toggle() activa el modo oscuro, aplica la clase y persiste la preferencia', () => {
    const service = new ThemeService();
    service.init();

    service.toggle();

    expect(service.dark()).toBeTrue();
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBeTrue();
    expect(localStorage.getItem('todo.theme')).toBe('dark');
  });

  it('toggle() dos veces vuelve a claro', () => {
    const service = new ThemeService();
    service.init();

    service.toggle();
    service.toggle();

    expect(service.dark()).toBeFalse();
    expect(document.documentElement.classList.contains('ion-palette-dark')).toBeFalse();
    expect(localStorage.getItem('todo.theme')).toBe('light');
  });
});
