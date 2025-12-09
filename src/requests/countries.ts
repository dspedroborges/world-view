export const fetchCountry = async (name: string) => {
  const url = `/api-countries/name/${encodeURIComponent(name)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};