export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function successResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}

export function errorResponse(code: string, message: string, requestId?: string): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      requestId,
    },
  };
}
