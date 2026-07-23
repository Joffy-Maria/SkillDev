import { create } from 'zustand';
import { AppNotification } from '@/types';

interface AppState {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  
  bookmarkedIds: string[];
  toggleBookmark: (materialId: string) => void;
  
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Active coding playground transient state
  activeCode: string;
  activeLanguage: string;
  setActiveCode: (code: string) => void;
  setActiveLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  bookmarkedIds: [],
  toggleBookmark: (materialId) =>
    set((state) => ({
      bookmarkedIds: state.bookmarkedIds.includes(materialId)
        ? state.bookmarkedIds.filter((id) => id !== materialId)
        : [...state.bookmarkedIds, materialId],
    })),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  clearNotifications: () => set({ notifications: [] }),

  activeCode: `# SkillDev Python 3 Playground\ndef solve():\n    print("Hello, SkillDev!")\n\nif __name__ == "__main__":\n    solve()`,
  activeLanguage: 'python',
  setActiveCode: (code) => set({ activeCode: code }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
}));
