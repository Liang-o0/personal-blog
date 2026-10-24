import { getCollection } from 'astro:content';
import { createPostIndex } from './post-index';

export { postUrl, seriesUrl } from './post-index';

export async function getPostIndex() {
  const [posts, series] = await Promise.all([getCollection('posts'), getCollection('series')]);
  return createPostIndex(posts, series);
}

export type SeriesPage = ReturnType<Awaited<ReturnType<typeof getPostIndex>>['getSeriesPage']>;
