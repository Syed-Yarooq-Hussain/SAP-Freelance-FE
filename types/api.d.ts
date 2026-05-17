export interface ApiPagination {
  total: number;
  current_page: number;
  limit: number;
  total_pages: number;
  next_page: number | null;
  previous_page: number | null;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface ApiResponse<T = null> {
  code: number;
  status: string;
  message: string;
  data: T | null;
  pagination?: ApiPagination;
}
