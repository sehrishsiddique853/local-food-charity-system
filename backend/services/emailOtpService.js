import bcrypt from "bcryptjs";
import crypto from "crypto";
import EmailOtp from "../models/EmailOtp.js";
import ApiError from "../utils/ApiError.js";

const OTP_EXPIRY_MINUTES = 10;

const normalizeEmail = (email) => email.trim().toLowerCase();

export const createRegistrationOtp = async ({ email, role }) => {
  const normalizedEmail = normalizeEmail(email);
  const otp = String(crypto.randomInt(100000, 1000000));
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await EmailOtp.deleteMany({
    email: normalizedEmail,
    role,
    purpose: "registration",
  });

  await EmailOtp.create({
    email: normalizedEmail,
    role,
    purpose: "registration",
    otpHash,
    expiresAt,
  });

  return {
    otp,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  };
};

export const assertValidRegistrationOtp = async ({ email, role, otp }) => {
  const otpRecord = await EmailOtp.findOne({
    email: normalizeEmail(email),
    role,
    purpose: "registration",
  }).sort({ createdAt: -1 });

  if (!otpRecord || otpRecord.expiresAt <= new Date()) {
    throw new ApiError(400, "OTP_EXPIRED", "Verification code has expired. Please request a new code.");
  }

  const matches = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!matches) {
    throw new ApiError(400, "INVALID_OTP", "Invalid verification code.");
  }

  return otpRecord;
};

export const consumeRegistrationOtp = async (otpRecordId) => {
  await EmailOtp.findByIdAndDelete(otpRecordId);
};
