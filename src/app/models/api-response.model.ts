export interface ApiResponse<T> {
  statusCode: number;
  error?: any;
  data: T;
  message?: string;
}