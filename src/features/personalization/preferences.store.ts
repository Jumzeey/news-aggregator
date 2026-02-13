import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PreferencesStore } from "./preferences.types";

const DEFAULT_PREFERENCES = {
  preferredSources: ["newsapi", "guardian", "nyt"],
  preferredCategories: [] as string[],
  preferredAuthors: [] as string[],
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setPreferredSources: (sources) => set({ preferredSources: sources }),

      setPreferredCategories: (categories) =>
        set({ preferredCategories: categories }),

      addPreferredAuthor: (author) =>
        set((state) => ({
          preferredAuthors: state.preferredAuthors.includes(author)
            ? state.preferredAuthors
            : [...state.preferredAuthors, author],
        })),

      removePreferredAuthor: (author) =>
        set((state) => ({
          preferredAuthors: state.preferredAuthors.filter((a) => a !== author),
        })),

      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "news-preferences",
    }
  )
);
