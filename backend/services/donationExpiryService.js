import Donation from "../models/Donation.js";
import DonationRequest from "../models/DonationRequest.js";
import { notifyDonationExpired } from "./notificationService.js";

const EXPIRABLE_DONATION_STATUSES = ["available", "requested"];

export const expireStaleDonations = async (now = new Date()) => {
  const expiredDonations = await Donation.find({
    status: { $in: EXPIRABLE_DONATION_STATUSES },
    expiryDate: { $lte: now },
    isActive: true,
  }).select("_id donor foodTitle");

  if (!expiredDonations.length) {
    return { expiredDonations: 0, removedRequests: 0 };
  }

  const expiredDonationIds = expiredDonations.map((donation) => donation._id);

  const [donationResult, requestResult] = await Promise.all([
    Donation.updateMany(
      { _id: { $in: expiredDonationIds } },
      { $set: { status: "expired", isActive: false } }
    ),
    DonationRequest.deleteMany(
      {
        donation: { $in: expiredDonationIds },
        requestStatus: "pending",
      }
    ),
  ]);

  await Promise.all(expiredDonations.map((donation) => notifyDonationExpired(donation)));

  return {
    expiredDonations: donationResult.modifiedCount || 0,
    removedRequests: requestResult.deletedCount || 0,
  };
};

export const startDonationExpiryJob = () => {
  const intervalMinutes = Number(process.env.DONATION_EXPIRY_INTERVAL_MINUTES || 15);
  const intervalMs = Math.max(intervalMinutes, 1) * 60 * 1000;

  const runExpiry = async () => {
    try {
      await expireStaleDonations();
    } catch (err) {
      console.error("Donation expiry job failed:", err.message);
    }
  };

  runExpiry();
  return setInterval(runExpiry, intervalMs);
};
