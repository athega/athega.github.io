// JSON inside a script element must not contain an HTML closing tag.
// Escaping '<' preserves the data without allowing it to end the element.
export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
