// Use the same UTC year as the post permalinks and Liquid date settings.
export function groupPostsByYear(posts) {
  const groups = new Map();
  for (const post of [...posts].sort((a, b) => b.date - a.date)) {
    const year = String(post.date.getUTCFullYear());
    if (!groups.has(year)) groups.set(year, { year, url: `/blogg/${year}/`, posts: [] });
    groups.get(year).posts.push(post);
  }
  return [...groups.values()];
}

export function archiveRedirects(redirects, archives) {
  const years = new Set(archives.map((archive) => archive.year));
  return redirects.filter((redirect) => {
    const year = redirect.from.match(/^\/blogg\/(\d{4})\/$/)?.[1];
    return !years.has(year); // A populated archive replaces its old fallback redirect.
  }).map((redirect) => {
    const year = redirect.from.match(/^\/(?:arkiv\/)?(\d{4})\/\d{1,2}\/$/)?.[1];
    if (redirect.to === "/blogg/" && years.has(year)) {
      return { ...redirect, to: `/blogg/${year}/`, title: `Blogg ${year}` };
    }
    return redirect;
  });
}
