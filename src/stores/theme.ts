import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          document.documentElement.classList.toggle('dark', newIsDark);
          return { isDark: newIsDark };
        });
      },
      setTheme: (theme) => {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        set({ isDark });
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
);
