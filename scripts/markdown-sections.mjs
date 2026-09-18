// Only the explicit {% section %} blocks use these presentation rules.
// Parse Markdown tokens, never HTML strings or heading text, so normal Markdown
// (inline formatting, nested lists, links and fenced code) keeps its semantics.
function blocksFrom(tokens) {
  const blocks = [];
  for (let i = 0; i < tokens.length;) {
    const start = i++;
    let depth = tokens[start].nesting;
    while (depth > 0 && i < tokens.length) depth += tokens[i++].nesting;
    blocks.push(tokens.slice(start, i));
  }
  return blocks;
}

function splitAt(blocks, predicate) {
  const groups = [[]];
  for (const block of blocks) {
    if (predicate(block)) groups.push([]);
    groups.at(-1).push(block);
  }
  return groups;
}

function isHeading(block, tag) {
  return block?.[0].type === 'heading_open' && block[0].tag === tag;
}

function inlineTokens(block) {
  return block?.find(token => token.type === 'inline')?.children || [];
}

function isLink(block) {
  if (block?.[0].type !== 'paragraph_open') return false;
  const tokens = inlineTokens(block);
  // A paragraph containing one link, not an ordinary paragraph with inline links.
  return tokens[0]?.type === 'link_open' && tokens.at(-1)?.type === 'link_close'
    && tokens.filter(token => token.type === 'link_open').length === 1;
}

const variants = {
  hero: ['default', 'ai', 'industry', 'technical-review'],
  focus: ['default', 'stacked'], steps: ['default', 'stacked', 'soft'],
  cases: ['default', 'facts'], callout: ['default', 'light', 'dark', 'network'],
  values: ['default'], community: ['default'], audiences: ['default'],
  'work-intro': ['default'], profile: ['default'], benefits: ['default'],
  history: ['default'], company: ['default'], team: ['default'], facts: ['default'],
};

export function createSectionRenderer(md, renderTemplate) {
  const render = blocks => md.renderer.render(blocks.flat(), md.options, {});
  const inline = block => md.renderer.renderInline(inlineTokens(block), md.options, {});
  const paragraph = (block, className) => {
    if (!block || block[0].type !== 'paragraph_open') throw new Error(`Expected a Markdown paragraph for ${className}.`);
    block[0].attrSet('class', className);
    return render([block]);
  };
  function header(blocks, tag = 'h2') {
    let eyebrow = '';
    if (blocks[0]?.[0].type === 'paragraph_open') eyebrow = paragraph(blocks.shift(), 'eyebrow');
    const headingBlock = isHeading(blocks[0], tag) ? blocks.shift() : null;
    if (headingBlock && tag === 'h1') {
      // Emphasis in the hero heading is the existing orange span.
      for (const token of inlineTokens(headingBlock)) {
        if (token.type === 'em_open' || token.type === 'em_close') token.tag = 'span';
      }
    }
    const heading = headingBlock ? render([headingBlock]) : '';
    return { eyebrow, heading };
  }
  function links(blocks, dark = false) {
    const result = [];
    while (isLink(blocks.at(-1))) {
      const block = blocks.pop();
      const tokens = inlineTokens(block);
      tokens[0].attrSet('class', dark ? 'text-link light' : 'text-link');
      const arrow = new tokens[0].constructor('html_inline', '', 0);
      arrow.content = ' <span>↗</span>';
      tokens.splice(-1, 0, arrow);
      result.unshift(inline(block));
    }
    return result;
  }
  function features(blocks) {
    for (const block of blocks) {
      if (block[0].type !== 'bullet_list_open') continue;
      block[0].attrSet('class', 'feature-list');
      for (let i = block.length - 1; i >= 0; i--) {
        const token = block[i];
        if (token.type === 'list_item_open' && token.level === block[0].level + 1) {
          const check = new token.constructor('html_inline', '', 0);
          check.content = '<span>✓</span> ';
          block.splice(i + 1, 0, check);
        }
      }
    }
    return render(blocks);
  }
  function cards(blocks) {
    const [intro, ...groups] = splitAt(blocks, block => isHeading(block, 'h3'));
    return { intro, cards: groups.map(group => ({ heading: render([group.shift()]), body: render(group) })) };
  }

  return async function renderSection(source, kind, variant = 'default', id = '') {
    if (!Object.hasOwn(variants, kind)) throw new Error(`Unknown Markdown section: ${kind}`);
    if (!variants[kind].includes(variant)) throw new Error(`Unknown ${kind} variant: ${variant}`);
    const blocks = blocksFrom(md.parse(source.trim(), {}));
    const data = { kind, variant, id };
    let template;
    switch (kind) {
      case 'hero': {
        template = 'hero';
        Object.assign(data, header(blocks, 'h1'));
        if (!data.heading) throw new Error('A hero needs a # heading.');
        data.links = links(blocks);
        data.lead = paragraph(blocks.shift(), 'page-lead');
        data.summary = variant === 'ai' ? render(blocks) : blocks.map(block => paragraph(block, 'hero-summary')).join('');
        break;
      }
      case 'focus': case 'steps': case 'cases': case 'values': case 'community': {
        template = 'cards';
        const parts = cards(blocks);
        Object.assign(data, header(parts.intro));
        data.intro = parts.intro.map(block => paragraph(block, 'heading-note')).join('');
        data.cards = parts.cards;
        if (!data.cards.length) throw new Error(`${kind} needs at least one ### card heading.`);
        break;
      }
      case 'audiences': {
        template = 'audiences';
        const groups = [[]];
        for (const block of blocks) {
          if (block[0].type === 'hr') groups.push([]);
          else groups.at(-1).push(block);
        }
        const intro = groups.shift();
        Object.assign(data, header(intro));
        data.intro = intro.map(block => paragraph(block, 'heading-note')).join('');
        data.cards = groups.map((group, index) => {
          const card = header(group, 'h3');
          if (!card.heading) throw new Error('Each audience needs a ### heading after a --- separator.');
          card.links = links(group, index % 2 === 1);
          card.body = features(group);
          return card;
        });
        if (!data.cards.length) throw new Error('Separate the audience cards with --- on its own line.');
        break;
      }
      case 'callout': {
        template = 'callout';
        Object.assign(data, header(blocks));
        if (variant === 'network') {
          const quoteBlock = blocks.pop();
          if (quoteBlock?.[0].type !== 'blockquote_open') throw new Error('A network callout ends with a Markdown > quote.');
          const quote = blocksFrom(quoteBlock.slice(1, -1));
          data.quote = { eyebrow: paragraph(quote.shift(), 'eyebrow'), body: render(quote) };
          const image = blocks.pop();
          if (inlineTokens(image)[0]?.type !== 'image') throw new Error('Place the portrait image immediately before the quote.');
          data.quote.image = inline(image);
        }
        data.links = links(blocks, variant === 'dark');
        data.body = render(blocks);
        break;
      }
      case 'work-intro': case 'profile': case 'benefits': case 'history': case 'company': case 'team': {
        template = 'prose';
        if (kind === 'history') data.eyebrow = paragraph(blocks.shift(), 'eyebrow');
        else if (kind !== 'work-intro') Object.assign(data, header(blocks));
        data.links = links(blocks);
        if (kind === 'team') data.intro = paragraph(blocks.shift(), 'heading-note');
        data.body = kind === 'profile' || kind === 'benefits' ? features(blocks) : render(blocks);
        break;
      }
      case 'facts': {
        template = 'facts';
        const [intro, ...groups] = splitAt(blocks, block => isHeading(block, 'h3'));
        if (intro.length) throw new Error('Start each fact with a ### value.');
        data.facts = groups.map(group => ({ value: inline(group.shift()), body: render(group) }));
        break;
      }
      default: throw new Error(`Unknown Markdown section: ${kind}`);
    }
    return '\n' + await renderTemplate(`sections/${template}.html`, data) + '\n';
  };
}

export default function markdownSections(eleventyConfig) {
  let markdown;
  let liquid;
  eleventyConfig.amendLibrary('md', library => { markdown = library; });
  eleventyConfig.amendLibrary('liquid', library => { liquid = library; });
  // These pages render Markdown inside explicit sections. Parsing the resulting
  // HTML a second time would wrap indented tags and links in extra paragraphs.
  // Ordinary pages, profiles and posts keep Eleventy's normal Markdown pipeline.
  eleventyConfig.addPreprocessor('section-pages', 'md', (data) => {
    if (data.layout === 'sections') data.templateEngineOverride = 'liquid';
  });
  eleventyConfig.addPairedShortcode('section', async function (content, kind, variant, id) {
    try {
      const renderSection = createSectionRenderer(markdown, (file, data) => liquid.renderFile(file, data));
      return await renderSection(content, kind, variant, id);
    } catch (error) {
      throw new Error(`${this.page?.inputPath || 'Markdown'}: section "${kind}": ${error.message}`, { cause: error });
    }
  });
  eleventyConfig.addWatchTarget('_includes/sections/');
}
