import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './constants';

export type PaginationInput = {
  page?: number;
  limit?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  offset: number;
};

function normalizePositiveInteger(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const parsed = Math.floor(value);
  return parsed > 0 ? parsed : fallback;
}

export function toPagination(input: PaginationInput): Pagination {
  const page = normalizePositiveInteger(input.page ?? DEFAULT_PAGE, DEFAULT_PAGE);
  const requestedLimit = normalizePositiveInteger(
    input.limit ?? DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE
  );
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}
