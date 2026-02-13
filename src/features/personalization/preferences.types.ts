export interface UserPreferences {
  preferredSources: string[];
  preferredCategories: string[];
  preferredAuthors: string[];
}

export interface PreferencesActions {
  setPreferredSources: (sources: string[]) => void;
  setPreferredCategories: (categories: string[]) => void;
  addPreferredAuthor: (author: string) => void;
  removePreferredAuthor: (author: string) => void;
  resetPreferences: () => void;
}

export type PreferencesStore = UserPreferences & PreferencesActions;
