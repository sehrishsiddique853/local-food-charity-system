// Global error-handling middleware.
// It normalizes errors into the app's standard error response format.
import { errorResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Handle MongoDB duplicate-key errors cleanly.
  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(
      res,
      409,
      "DUPLICATE_FIELD",
      `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`,
      { field }
    );
  }

  // Handle service-generated ApiError instances.
  if (err instanceof ApiError) {
    return errorResponse(res, err.statusCode, err.errorCode, err.message, err.details);
  }

  // Fallback for any unexpected errors.
  return errorResponse(res, err.statusCode || 500, err.errorCode || "INTERNAL_SERVER_ERROR", err.message || "Internal server error");
};

export default errorHandler;
