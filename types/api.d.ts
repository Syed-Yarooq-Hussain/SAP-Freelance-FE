export interface ApiResponse<T = null> {
  code: number;
  status: string;
  message: string;
  data: T | null;
}
