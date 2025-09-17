export interface ApiResponse<T> {
  success?: { message: string; data: T };
  error?: { message: string; code?: number };
}
