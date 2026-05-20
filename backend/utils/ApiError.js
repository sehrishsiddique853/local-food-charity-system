// Custom error type for service-layer errors.
// Controllers and error middleware can use this to send structured API errors.
class ApiError extends Error {
  constructor(statusCode, errorCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
