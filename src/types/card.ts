export type CardContentEntry = {
  name: string;
  capital: string;
  subregion: string;
  region: string;
  demonym: string;
  independent: string;
  gini: string;
  languages: string;
  currencies: string;
};

export type CardContent = {
  pt: CardContentEntry;
  en: CardContentEntry;
};