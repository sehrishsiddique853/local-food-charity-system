// Shared response helpers for consistent API response shape.
// Use successResponse for successful operations and errorResponse for failures.
export const successResponse = (res, statusCode, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, statusCode, errorCode, message, details = null) => {
  const errorPayload = {
    code: errorCode,
    message,
  };

  if (details !== null && details !== undefined) {
    errorPayload.details = details;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorPayload,
  });
};
