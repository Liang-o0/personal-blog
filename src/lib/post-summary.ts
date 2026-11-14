/** The public metadata needed by lists and search; deliberately excludes article bodies. */
export interface PostSummary {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  date: string;
  order?: number;
  seriesTitle?: string;
}

export function summarizePost(post: { id: string; data: { title: string; description?: string; tags: string[]; pubDate: Date; seriesOrder?: number } }, seriesTitle?: string): PostSummary {
  return {
    id: post.id, title: post.data.title, description: post.data.description,
    tags: post.data.tags, date: post.data.pubDate.toISOString().slice(0, 10), order: post.data.seriesOrder, seriesTitle,
  };
}
