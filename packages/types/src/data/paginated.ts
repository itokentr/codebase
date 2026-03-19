export interface PaginationRequest {
  readonly index: number;
  readonly itemsPerPage: number;
}

export interface PaginationResponse<T> {
  readonly allItems: number;
  readonly allPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
  readonly index: number;
  readonly items: readonly T[];
  readonly itemsPerPage: number;
}
