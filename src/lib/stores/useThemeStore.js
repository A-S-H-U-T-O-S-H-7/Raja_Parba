// stores/useThemeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      isDarkMode: false,
      mounted: false,

      // Actions
      setMounted: (mounted) => set({ mounted }),
      
      setIsDarkMode: (isDarkMode) => {
        set({ isDarkMode });
        this.applyTheme(isDarkMode);
      },

      // Toggle theme
      toggleTheme: () => {
        const { isDarkMode } = get();
        const newMode = !isDarkMode;
        set({ isDarkMode: newMode });
        get().applyTheme(newMode);
      },

      // Set dark mode
      setDarkMode: () => {
        set({ isDarkMode: true });
        get().applyTheme(true);
      },

      // Set light mode
      setLightMode: () => {
        set({ isDarkMode: false });
        get().applyTheme(false);
      },

      // Apply theme to DOM
      applyTheme: (isDark) => {
        if (typeof window === 'undefined') return;
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Initialize theme
      initializeTheme: () => {
        if (typeof window === 'undefined') return;
        
        set({ mounted: true });
        
        // Get saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
          const isDark = savedTheme === 'dark';
          set({ isDarkMode: isDark });
          get().applyTheme(isDark);
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDarkMode: prefersDark });
          get().applyTheme(prefersDark);
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => {
          // Only apply system preference if no saved theme
          if (!localStorage.getItem('theme')) {
            set({ isDarkMode: e.matches });
            get().applyTheme(e.matches);
          }
        };

        mediaQuery.addEventListener('change', handler);
        
        // Return cleanup function
        return () => mediaQuery.removeEventListener('change', handler);
      },

      // Reset theme to system preference
      resetToSystemPreference: () => {
        if (typeof window === 'undefined') return;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        set({ isDarkMode: prefersDark });
        get().applyTheme(prefersDark);
        localStorage.removeItem('theme');
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

// Auto-initialize theme
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    useThemeStore.getState().initializeTheme();
  }, 0);
}

export default useThemeStore;