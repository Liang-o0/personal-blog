import type { PostSummary } from './post-summary';
import { ARCHIVE_PAGE_SIZE, ARCHIVE_PAGE_SIZES } from './archive-pagination.ts';

export interface SearchFilters { keyword: string; start: string; end: string }

export function filterSeriesPosts(posts: PostSummary[], filters: SearchFilters) {
  const keyword = filters.keyword.trim().normalize('NFKC').toLocaleLowerCase();
  // One selected date means that day; two dates define an inclusive range.
  const start = filters.start || filters.end;
  const end = filters.end || filters.start;
  return posts.filter(post => {
    const fields = [post.title, post.description ?? '', ...post.tags];
    return (!keyword || fields.some(field => field.normalize('NFKC').toLocaleLowerCase().includes(keyword)))
      && (!start || post.date >= start)
      && (!end || post.date <= end);
  });
}

function validDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : '';
}

export function readSearchParams(params: URLSearchParams) {
  const page = Number(params.get('page') ?? 1);
  const size = Number(params.get('size') ?? ARCHIVE_PAGE_SIZE);
  return {
    filters: { keyword: params.get('q') ?? '', start: validDate(params.get('start')), end: validDate(params.get('end')) },
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: ARCHIVE_PAGE_SIZES.some(value => value === size) ? size : ARCHIVE_PAGE_SIZE,
  };
}

export function searchUrl(basePath: string, filters: SearchFilters, page: number, pageSize: number) {
  const params = new URLSearchParams();
  if (filters.keyword.trim()) params.set('q', filters.keyword.trim());
  if (filters.start) params.set('start', filters.start);
  if (filters.end) params.set('end', filters.end);
  params.set('page', String(page));
  params.set('size', String(pageSize));
  return `${basePath}?${params}`;
}
