import { create } from 'zustand';

export const lightColors = {
  primary: '#0A84FF',
  primaryDark: '#0066CC',
  primaryLight: '#EBF5FF',
  background: '#F0F6FF',
  card: '#FFFFFF',
  surface: '#E8F1FC',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#DCE8F6',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
};

export const darkColors = {
  primary: '#0A84FF',
  primaryDark: '#0066CC',
  primaryLight: '#1E293B',
  background: '#0D1B2A',
  card: '#1E293B',
  surface: '#273549',
  text: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#334155',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
};

export const useThemeStore = create((set, get) => ({
  mode: 'light',
  colors: lightColors,

  setThemeMode: (mode) => {
    const activeColors = mode === 'dark' ? darkColors : lightColors;
    set({ mode, colors: activeColors });
  },

  toggleTheme: () => {
    const currentMode = get().mode;
    const nextMode = currentMode === 'light' ? 'dark' : 'light';
    const nextColors = nextMode === 'dark' ? darkColors : lightColors;
    set({ mode: nextMode, colors: nextColors });
  },
}));
