/**
 * Wrap standalone markdown images in the site's plate figure so their alt
 * text renders as a visible caption:
 *
 *   <p><img alt="…"></p>  →  <figure class="plate-fig">
 *                              <div class="plate"><img></div>
 *                              <figcaption class="plate-cap">…</figcaption>
 *                            </figure>
 *
 * Only paragraphs whose sole content is a single image are transformed, so
 * inline images inside prose are left untouched.
 */
export default function rehypePlateFigures() {
  return (tree) => {
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (
          child.type === "element" &&
          child.tagName === "p" &&
          child.children.filter((c) => !(c.type === "text" && c.value.trim() === "")).length === 1
        ) {
          const img = child.children.find((c) => c.type === "element" && c.tagName === "img");
          if (img) {
            const caption = img.properties?.alt ?? "";
            const figChildren = [
              { type: "element", tagName: "div", properties: { className: ["plate"] }, children: [img] },
            ];
            if (caption) {
              figChildren.push({
                type: "element",
                tagName: "figcaption",
                properties: { className: ["plate-cap"] },
                children: [{ type: "text", value: caption }],
              });
            }
            return {
              type: "element",
              tagName: "figure",
              properties: { className: ["plate-fig"] },
              children: figChildren,
            };
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
