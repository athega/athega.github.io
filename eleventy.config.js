import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownSections from "./scripts/markdown-sections.mjs";
import imageAttributes from "./scripts/image-attributes.mjs";
import postDefaults from "./scripts/post-defaults.mjs";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(markdownSections);
  eleventyConfig.addPlugin(imageAttributes);
  eleventyConfig.addPlugin(postDefaults);
  // Drafts: exkludera helt vid build, visa vid serve/watch
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Syntax highlighting för kodblock
  eleventyConfig.addPlugin(syntaxHighlight);

  // Liquid-inställningar (undvik datumfel med timezone)
  eleventyConfig.setLiquidOptions({
    timezoneOffset: 0
  });

  // Tillåt permalinks utan filändelse (som Jekyll)
  eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });

  // Default layout (ersätter Jekyll's defaults i _config.yml)
  eleventyConfig.addGlobalData("layout", "default");

  // Posts collection med next/previous
  eleventyConfig.addCollection("posts", function(collection) {
    const posts = collection.getFilteredByGlob("_posts/*.md")
      .sort((a, b) => b.date - a.date);
    posts.forEach((post, i) => {
      post.data.next = posts[i + 1];
      post.data.previous = posts[i - 1];
    });
    return posts;
  });

  // Sidor som ska med i sitemap.xml: allt utom 404 och årsarkiv utan inlägg
  eleventyConfig.addCollection("sitemapPages", function(collection) {
    const postYears = new Set(collection.getFilteredByGlob("_posts/*.md")
      .map((post) => String(post.date.getUTCFullYear())));
    return collection.getAll().filter((item) => {
      if (!item.url || item.url === "/404.html" || item.data.sitemap === false) return false;
      if (item.data.year && !postYears.has(String(item.data.year))) return false;
      return true;
    });
  });

  // Employees collection (sorterad alfabetiskt efter filnamn)
  eleventyConfig.addCollection("employees", function(collection) {
    return collection.getFilteredByGlob("_employees/*.md")
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath));
  });

  // Svenska datum-filter
  eleventyConfig.addFilter("swedishDate", (date) => {
    const months = ["januari", "februari", "mars", "april", "maj", "juni",
                    "juli", "augusti", "september", "oktober", "november", "december"];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  // Filter för att ta bort .html-extension från URL:er (för og:url etc.)
  eleventyConfig.addFilter("removeHtmlExtension", (url) => {
    if (url && url.endsWith(".html")) {
      return url.slice(0, -5);
    }
    return url;
  });

  // Kopiera assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  // Kopiera bilder från innehållsmappar
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.addPassthroughCopy("**/*.jpeg");
  eleventyConfig.addPassthroughCopy("**/*.png");
  eleventyConfig.addPassthroughCopy("**/*.gif");
  eleventyConfig.addPassthroughCopy("**/*.svg");
  eleventyConfig.addPassthroughCopy("**/*.webp");

  // Ta bort .liquid-filer från output efter build (de processas separat)
  eleventyConfig.on('eleventy.after', async () => {
    const fs = await import('fs/promises');
    try {
      await fs.unlink('_site/assets/site.js.liquid');
    } catch (e) {
      // Filen kanske inte finns, ignorera
    }
  });

  // Exkludera assets/blog från template-processing (innehåller Mustache-kod och demo-filer)
  eleventyConfig.ignores.add("assets/blog/**/*.html");
  eleventyConfig.ignores.add("assets/blog/**/*.md");

  // Ignorera dokumentationsfiler (ska inte generera sidor)
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("AGENTS.md");

  // Ignorera SCSS-filer (kompileras separat)
  eleventyConfig.ignores.add("**/*.scss");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    }
  };
};

export const config = {
  templateFormats: ["html", "liquid", "md"],
};
