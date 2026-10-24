/** Pure content rules, independent of Astro loading and page rendering. */
export interface PostRecord {
  id: string;
  data: {
    pubDate: Date;
    draft: boolean;
    series?: { id: string };
    seriesOrder?: number;
  };
}

export interface SeriesRecord {
  id: string;
  data: { order: number };
}

export const SERIES_PAGE_SIZE = 30;
const byId = (a: { id: string }, b: { id: string }) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

export function seriesUrl(id: string, page = 1) {
  const base = `/posts/series/${encodeURIComponent(id)}`;
  return page === 1 ? base : `${base}/page/${page}`;
}

export function postUrl(id: string) {
  return `/posts/${encodeURIComponent(id)}`;
}

export function createPostIndex<P extends PostRecord, S extends SeriesRecord>(allPosts: P[], allSeries: S[]) {
  const series = [...allSeries].sort((a, b) => a.data.order - b.data.order || byId(a, b));
  const seriesById = new Map(series.map(item => [item.id, item]));
  const positions = new Map<string, Map<number, string>>();

  // Validate before filtering: drafts must not reserve conflicting positions.
  for (const post of allPosts) {
    const { series: reference, seriesOrder } = post.data;
    if ((reference !== undefined) !== (seriesOrder !== undefined)) {
      throw new Error(`文章 "${post.id}"：series 与 seriesOrder 必须同时提供或同时省略`);
    }
    if (!reference) continue;
    if (!Number.isInteger(seriesOrder) || seriesOrder! <= 0) {
      throw new Error(`文章 "${post.id}"：seriesOrder 必须为正整数`);
    }
    if (!seriesById.has(reference.id)) {
      throw new Error(`文章 "${post.id}" 引用了不存在的专题 "${reference.id}"`);
    }
    const used = positions.get(reference.id) ?? new Map<number, string>();
    const conflicting = used.get(seriesOrder!);
    if (conflicting !== undefined) {
      throw new Error(`专题 "${reference.id}" 的序号 ${seriesOrder} 重复：文章 "${conflicting}" 与 "${post.id}"`);
    }
    used.set(seriesOrder!, post.id);
    positions.set(reference.id, used);
  }

  const posts = allPosts.filter(post => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || byId(a, b));
  const grouped = new Map(series.map(item => [item.id, [] as P[]]));
  for (const post of posts) {
    if (post.data.series) grouped.get(post.data.series.id)!.push(post);
  }
  for (const group of grouped.values()) {
    group.sort((a, b) => a.data.seriesOrder! - b.data.seriesOrder! || byId(a, b));
  }

  function getSeriesPosts(id: string): P[] {
    const group = grouped.get(id);
    if (!group) throw new Error(`不存在的专题 "${id}"`);
    return [...group];
  }

  function getSeriesPage(id: string, page = 1) {
    const entries = getSeriesPosts(id);
    const pageCount = Math.max(1, Math.ceil(entries.length / SERIES_PAGE_SIZE));
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      throw new Error(`专题 "${id}" 不存在第 ${page} 页`);
    }
    return {
      series: seriesById.get(id)!,
      posts: entries.slice((page - 1) * SERIES_PAGE_SIZE, page * SERIES_PAGE_SIZE),
      total: entries.length,
      page,
      pageCount,
    };
  }

  function getAdjacentPosts(post: P) {
    const inSeries = post.data.series !== undefined;
    const entries = inSeries ? getSeriesPosts(post.data.series!.id) : posts;
    const position = entries.findIndex(entry => entry.id === post.id);
    if (position < 0) return { previous: undefined, next: undefined };
    return {
      previous: entries[position + (inSeries ? -1 : 1)],
      next: entries[position + (inSeries ? 1 : -1)],
    };
  }

  return { posts, series, seriesById, getSeriesPosts, getSeriesPage, getAdjacentPosts };
}
