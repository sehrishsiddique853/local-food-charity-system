import User from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

const ensureNgoApproved = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("role ngoVerificationStatus isBlocked");

  if (!user || user.role !== "ngo") {
    return errorResponse(res, 403, "NGO_ONLY", "Only NGOs can access this resource");
  }

  if (user.isBlocked) {
    return errorResponse(res, 403, "ACCOUNT_BLOCKED", "Your account is blocked");
  }

  if (user.ngoVerificationStatus !== "approved") {
    return errorResponse(
      res,
      403,
      "NGO_NOT_APPROVED",
      "Your NGO account must be approved before accessing donations"
    );
  }

  next();
};

export default ensureNgoApproved;
