import { create } from 'zustand';

type Language = 'pt' | 'en';

type Store = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const useLanguageStore = create<Store>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang })
}));