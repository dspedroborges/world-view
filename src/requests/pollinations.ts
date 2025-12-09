export const fetchComment = async (prompt: string) => {
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Unable to reach Pollinations");
  }

  const text = await res.text();
  return text;
};