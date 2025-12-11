export function paintByName(svg: SVGSVGElement, key: string, color: string) {
  svg.querySelectorAll("path").forEach(p => {
    p.setAttribute("fill", "lightgreen");
    p.setAttribute("stroke-width", ".2");
  });

  const esc = CSS.escape(key);

  const byName = `path[name="${key}"]`;
  const byTitle = `path[title="${key}"]`;

  const byClass = `path${key
    .split(/\s+/)
    .map(c => "." + CSS.escape(c))
    .join("")}`;

  const byId = `path#${esc}`;

  let selector = "";

  if (svg.querySelectorAll(byName).length > 0) selector = byName;
  else if (svg.querySelectorAll(byTitle).length > 0) selector = byTitle;
  else if (svg.querySelectorAll(byClass).length > 0) selector = byClass;
  else if (svg.querySelectorAll(byId).length > 0) selector = byId;
  else {
    console.log("Unable to find on SVG");
    return;
  }

  const paths = svg.querySelectorAll(selector);
  paths.forEach(p => {
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

  paintByName(svg, key, "green");
  recall(key);
};