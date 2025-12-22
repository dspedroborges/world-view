export function paintByName(
  svg: SVGSVGElement,
  key: string,
  color: string
) {
  if (!key || !key.trim()) return;

  svg.querySelectorAll("path").forEach(p => {
    p.setAttribute("fill", "lightgreen");
    p.setAttribute("stroke-width", ".2");
  });

  const safe = CSS.escape(key.trim());

  const byName = `path[name="${safe}"]`;
  const byTitle = `path[title="${safe}"]`;
  const byId = `path#${safe}`;

  const classSelector =
    key
      .split(/\s+/)
      .map(c => c.trim())
      .filter(Boolean)
      .map(c => "." + CSS.escape(c))
      .join("");

  const byClass = classSelector ? `path${classSelector}` : "";

  let selector = "";

  const selectors = [byName, byTitle, byClass, byId];

  for (const sel of selectors) {
    if (!sel) continue;
    try {
      if (svg.querySelectorAll(sel).length > 0) {
        selector = sel;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!selector) return;

  svg.querySelectorAll(selector).forEach(p => {
    p.setAttribute("fill", color);
    p.setAttribute("stroke-width", "2");
  });
}

export const handleSvgClick = async (e: React.MouseEvent<SVGSVGElement>, svg: SVGSVGElement | null, recall: (key: string) => void) => {
  if (!svg) return;
  const target = e.target as SVGPathElement;

  if (!svg) return;
  if (target.tagName !== "path") return;

  const id = target.getAttribute("id");
  const name = target.getAttribute("name");
  const className = target.getAttribute("class");
  const key = name ?? className ?? id;
  if (!key) return;

  paintByName(svg, key, "teal");
  recall(key);
};