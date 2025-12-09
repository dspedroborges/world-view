export const fetchCountry = async (name: string) => {
  const base = import.meta.env.VITE_API_URL;
  const url = `${base}/name/${encodeURIComponent(name)}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
};
