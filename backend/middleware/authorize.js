import { errorResponse } from "../utils/apiResponse.js";

// Role authorization middleware.
// Use this after auth middleware to restrict access by user role.
export default function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized");
    if (!roles.includes(req.user.role)) return errorResponse(res, 403, "FORBIDDEN", "Forbidden");
    next();
  };
}
