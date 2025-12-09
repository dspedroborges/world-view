export const fetchComment = async (prompt: string) => {
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
  const res = await fetch(url);
  const text = await res.text();
  return text;
};