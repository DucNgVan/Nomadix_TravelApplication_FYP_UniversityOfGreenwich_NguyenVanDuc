import { useThemeStore, lightColors, darkColors } from '../../../src/stores/theme.store';

describe('Unit Test: Theme Store (Light Mode & Dark Mode)', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'light' });
  });

  test('RED-FE-THEME-01: should default to light mode with pale blue background and white cards', () => {
    const { mode, colors } = useThemeStore.getState();
    expect(mode).toBe('light');
    expect(colors.background).toBe('#F0F6FF');
    expect(colors.card).toBe('#FFFFFF');
    expect(colors.primary).toBe('#0A84FF');
    expect(colors.text).toBe('#0F172A');
  });

  test('RED-FE-THEME-02: toggleTheme should switch from light to dark mode and back to light', () => {
    useThemeStore.getState().toggleTheme();

    let state = useThemeStore.getState();
    expect(state.mode).toBe('dark');
    expect(state.colors.background).toBe('#0D1B2A');
    expect(state.colors.card).toBe('#1E293B');
    expect(state.colors.text).toBe('#FFFFFF');

    useThemeStore.getState().toggleTheme();
    state = useThemeStore.getState();
    expect(state.mode).toBe('light');
    expect(state.colors.background).toBe('#F0F6FF');
    expect(state.colors.card).toBe('#FFFFFF');
  });

  test('RED-FE-THEME-03: setThemeMode should explicitly set mode and corresponding palette', () => {
    useThemeStore.getState().setThemeMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
    expect(useThemeStore.getState().colors).toEqual(darkColors);

    useThemeStore.getState().setThemeMode('light');
    expect(useThemeStore.getState().mode).toBe('light');
    expect(useThemeStore.getState().colors).toEqual(lightColors);
  });
});
