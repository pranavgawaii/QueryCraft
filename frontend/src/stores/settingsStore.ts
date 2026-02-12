import { create } from "zustand";

import type { AppSettings } from "@/types";

const STORAGE_KEY = "querycraft-settings";

const defaultSettings: AppSettings = {
  defaultConnectionId: null,
  queryTimeoutSeconds: 30,
  maxRowsLimit: 1000,
};

const readSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
};

interface SettingsState {
  settings: AppSettings;
  initialize: () => void;
  updateSettings: (next: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,

  initialize: () => {
    set({ settings: readSettings() });
  },

  updateSettings: (next) => {
    const merged = { ...get().settings, ...next };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    set({ settings: merged });
  },
}));
