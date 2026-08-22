export class CustomError extends Error {
  public statusCode: number;
  public code?: string | number;
  public data?: unknown;

  constructor(
    statusCode: number = 400,
    message: string,
    options?: { code?: string | number; data?: unknown },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = options?.code;
    this.data = options?.data;
  }
}
