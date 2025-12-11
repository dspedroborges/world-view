import { countries } from "../data/countries";

export function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 1));
}

export const getListOfCountries = (): string[] => {
    const set = new Set();
    for (const country of countries) {
      set.add(country.name);
      set.add(country.nativeName);
      if (country.altSpellings) {
        country.altSpellings.forEach(sp => set.add(sp));
      }
      Object.values(country.translations).forEach(v => set.add(v));
    }
    return Array.from(set) as string[];
  }