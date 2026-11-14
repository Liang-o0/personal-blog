export const ARCHIVE_PAGE_SIZE = 10;
export const ARCHIVE_PAGE_SIZES = [10, 20, 50, 100] as const;

export interface PaginationTarget { basePath: string; anchor?: string }

export function archiveUrl(page: number, pageSize = ARCHIVE_PAGE_SIZE, target: PaginationTarget = { basePath: '/posts', anchor: 'all-posts' }) {
  const suffix = target.anchor ? `#${target.anchor}` : '';
  if (pageSize !== ARCHIVE_PAGE_SIZE) return `${target.basePath}/size/${pageSize}/page/${page}${suffix}`;
  return `${target.basePath}${page === 1 ? '' : `/page/${page}`}${suffix}`;
}

export function paginateArchive<T>(posts: T[], page = 1, pageSize = ARCHIVE_PAGE_SIZE) {
  if (!ARCHIVE_PAGE_SIZES.some(size => size === pageSize)) throw new Error(`不支持每页 ${pageSize} 篇`);
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new Error(`不存在文章列表第 ${page} 页`);
  }
  const offset = (page - 1) * pageSize;
  return { posts: posts.slice(offset, offset + pageSize), page, pageSize, pageCount, offset, total: posts.length };
}
