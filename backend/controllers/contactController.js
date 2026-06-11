import { sendContactMessageEmail } from "../services/emailService.js";
import { successResponse } from "../utils/apiResponse.js";

export const sendContactMessage = async (req, res, next) => {
  try {
    const emailInfo = await sendContactMessageEmail(req.body);

    console.log("Contact message email result:", {
      from: req.body.email,
      accepted: emailInfo.accepted,
      rejected: emailInfo.rejected,
      response: emailInfo.response,
    });

    return successResponse(res, 200, {
      message: "Message sent successfully. Our team will contact you shortly.",
    });
  } catch (err) {
    return next(err);
  }
};
