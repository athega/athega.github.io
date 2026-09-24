// Lets a blog post be a single Markdown file with no front matter:
//  - title: the first "# Heading" (removed from the body, since the template prints the title),
//    otherwise the file name.
//  - excerpt: `description` if given, otherwise the first paragraph as plain text.
//    Used for cards and meta description; the article's own lead still uses `description` only.
const EXCERPT_LENGTH = 200;

function plainText(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(content) {
  let inFence = false;
  for (const block of content.split(/\n\s*\n/)) {
    const lines = block.split("\n");
    if (lines.some((line) => /^\s*(```|~~~)/.test(line))) inFence = !inFence;
    if (inFence || /^\s*(#|!|<|[-*+>|`]|\d+\.|\{%)/.test(block)) continue;
    const text = plainText(block);
    if (text.length < 20) continue;
    if (text.length <= EXCERPT_LENGTH) return text;
    return text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, "") + "…";
  }
  return "";
}

const titleFromFileName = (inputPath) => {
  const slug = inputPath.split("/").pop().replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export default function postDefaults(eleventyConfig) {
  eleventyConfig.addPreprocessor("post-defaults", "md", (data, content) => {
    if (!/(^|\/)_posts\/[^/]+\.md$/.test(data.page?.inputPath ?? "")) return;
    let body = content;
    if (!data.title) {
      const heading = body.match(/^\s*#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
      if (heading && body.slice(0, heading.index).trim() === "") {
        data.title = plainText(heading[1]);
        body = body.replace(heading[0], "");
      } else {
        data.title = titleFromFileName(data.page.inputPath);
      }
    }
    data.excerpt = data.description || firstParagraph(body);
    return body;
  });
}
