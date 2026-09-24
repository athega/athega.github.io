import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createSectionRenderer } from './markdown-sections.mjs';

// Resolve the parsers from Eleventy's dependencies, just as the application does.
const require = createRequire(import.meta.resolve('@11ty/eleventy'));
const MarkdownIt = require('markdown-it');
const { Liquid } = require('liquidjs');
const markdown = new MarkdownIt({ html: true });
const liquid = new Liquid({ root: fileURLToPath(new URL('../_includes', import.meta.url)) });
const render = createSectionRenderer(markdown, (file, data) => liquid.renderFile(file, data));

test('cards can be added with Markdown headings without losing rich content', async () => {
  const original = '## Rubrik\n\n### Första\n\nEn **viktig** text med [en länk](/om-oss/).\n\nEtt andra stycke.\n\n- En punkt\n- En till';
  const before = await render(original, 'focus');
  const after = await render(original + '\n\n### Nästa kort\n\nNy text.', 'focus');
  assert.equal((before.match(/<article>/g) || []).length, 1);
  assert.equal((after.match(/<article>/g) || []).length, 2);
  assert.match(after, /<strong>viktig<\/strong>/);
  assert.match(after, /<a href="\/om-oss\/">en länk<\/a>/);
  assert.match(after, /<p>Ett andra stycke\.<\/p>/);
  assert.match(after, /<ul>\s*<li>En punkt<\/li>/);
  assert.doesNotMatch(after, /text-link|<span>01/);
});

test('code examples retain blank lines and headings inside fences do not create cards', async () => {
  const html = await render('## Kod\n\n### Exempel\n\n```text\nförsta raden\n\n### Ingen kortrubrik\n<script>\n```', 'focus');
  assert.equal((html.match(/<article>/g) || []).length, 1);
  assert.match(html, /första raden\n\n### Ingen kortrubrik\n&lt;script&gt;/);
});

test('only a standalone final link becomes a contact link', async () => {
  const html = await render('Kontakt\n\n## Prata med oss\n\nSe [beskrivningen](/om-oss/) först.\n\n[Mejla – reception@athega.se](mailto:reception@athega.se?subject=Fr%C3%A5ga%20%26%20svar)', 'callout', 'dark');
  assert.match(html, /<a href="\/om-oss\/">beskrivningen<\/a>/);
  assert.match(html, /href="mailto:reception@athega.se\?subject=Fr%C3%A5ga%20%26%20svar" class="text-link light"/);
  assert.equal((html.match(/<span>↗<\/span>/g) || []).length, 1);
});

test('nested and loose feature lists keep their Markdown content', async () => {
  const html = await render('## Trivs du här?\n\n- **Kunskap**\n  - Detalj\n\n- Samarbete\n\n  Med ett extra stycke.', 'profile');
  assert.equal((html.match(/<span>✓<\/span>/g) || []).length, 2);
  assert.match(html, /<strong>Kunskap<\/strong>/);
  assert.match(html, /<li>Detalj<\/li>/);
  assert.match(html, /<p>Med ett extra stycke\.<\/p>/);
});

test('hero emphasis is styled without changing emphasis in other sections', async () => {
  const hero = await render('Etikett\n\n# En *rubrik*\n\nIngress.', 'hero');
  const card = await render('## Sektion\n\n### Ett *kort*\n\nText.', 'focus');
  assert.match(hero, /<h1>En <span>rubrik<\/span><\/h1>/);
  assert.match(card, /<h3>Ett <em>kort<\/em><\/h3>/);
});

test('incorrect block names and variants give clear errors', async () => {
  await assert.rejects(render('Text', 'fokus'), /Unknown Markdown section: fokus/);
  await assert.rejects(render('Text', 'focus', 'stakced'), /Unknown focus variant: stakced/);
  await assert.rejects(render('Ingen rubrik', 'hero'), /hero needs a # heading/);
});
