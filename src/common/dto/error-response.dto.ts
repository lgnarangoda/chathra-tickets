/**
 * Standard error response format for frontend
 */
export interface ErrorResponseDto {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: any;
  errors?: ValidationError[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * Standard success response format
 */
export interface SuccessResponseDto<T = any> {
  success: true;
  statusCode: number;
  message?: string;
  data: T;
  timestamp: string;
}

