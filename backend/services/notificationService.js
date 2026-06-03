import Notification from "../models/Notification.js";
import User from "../models/User.js";

const createNotification = async ({
  receiver,
  title,
  message,
  type = "system",
  eventKey,
  relatedDonation = null,
  relatedRequest = null,
  dedupe = false,
}) => {
  if (!receiver || !title || !message) {
    return null;
  }

  if (dedupe && eventKey) {
    const existingNotification = await Notification.findOne({
      receiver,
      eventKey,
      relatedDonation,
      relatedRequest,
    });

    if (existingNotification) {
      return existingNotification;
    }
  }

  return Notification.create({
    receiver,
    title,
    message,
    type,
    eventKey,
    relatedDonation,
    relatedRequest,
  });
};

export const notifyDonationPosted = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Posted",
    message: `Your donation "${donation.foodTitle}" is now available for NGOs to request.`,
    type: "donation",
    eventKey: "donation_posted",
    relatedDonation: donation._id,
    dedupe: true,
  });

export const notifyApprovedNgosDonationAvailable = async (donation) => {
  const approvedNgos = await User.find({
    role: "ngo",
    ngoVerificationStatus: "approved",
    isBlocked: false,
  }).select("_id");

  return Promise.all(
    approvedNgos.map((ngo) =>
      createNotification({
        receiver: ngo._id,
        title: "New Donation Available",
        message: `"${donation.foodTitle}" is available for request.`,
        type: "donation",
        eventKey: "new_donation_available",
        relatedDonation: donation._id,
        dedupe: true,
      })
    )
  );
};

export const notifyDonationUpdated = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Updated",
    message: `Your available donation "${donation.foodTitle}" was updated successfully.`,
    type: "donation",
    eventKey: "donation_updated",
    relatedDonation: donation._id,
  });

export const notifyDonationCancelled = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Deleted",
    message: `Your donation "${donation.foodTitle}" was removed from active listings.`,
    type: "system",
    eventKey: "donation_cancelled",
    relatedDonation: donation._id,
    dedupe: true,
  });

export const notifyDonationExpired = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Expired",
    message: `Your donation "${donation.foodTitle}" expired before it was collected.`,
    type: "system",
    eventKey: "donation_expired",
    relatedDonation: donation._id,
    dedupe: true,
  });

export const notifyDonationBooked = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Booked",
    message: `Your donation "${donation.foodTitle}" has been booked by an NGO.`,
    type: "approval",
    eventKey: "donation_booked",
    relatedDonation: donation._id,
    dedupe: true,
  });

export const notifyDonationCollected = (donation) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Collected",
    message: `Your donation "${donation.foodTitle}" has been collected.`,
    type: "donation",
    eventKey: "donation_collected",
    relatedDonation: donation._id,
    dedupe: true,
  });

export const notifyDonationRequested = (donation, request) =>
  createNotification({
    receiver: donation.donor,
    title: "Donation Requested",
    message: `An NGO requested your donation "${donation.foodTitle}".`,
    type: "request",
    eventKey: "donation_requested",
    relatedDonation: donation._id,
    relatedRequest: request._id,
    dedupe: true,
  });

export const notifyNgoVerificationApproved = (ngo) =>
  createNotification({
    receiver: ngo._id,
    title: "NGO Approved",
    message: "Your NGO account has been approved. You can now request donations.",
    type: "approval",
    eventKey: "ngo_verification_approved",
    dedupe: true,
  });

export const notifyNgoVerificationRejected = (ngo, reason) =>
  createNotification({
    receiver: ngo._id,
    title: "NGO Verification Rejected",
    message: reason
      ? `Your NGO verification was rejected. Reason: ${reason}`
      : "Your NGO verification was rejected.",
    type: "rejection",
    eventKey: "ngo_verification_rejected",
  });

export const notifyNgoRequestApproved = (request, donation) =>
  createNotification({
    receiver: request.ngo,
    title: "Donation Request Approved",
    message: `Your request for "${donation.foodTitle}" was approved.`,
    type: "approval",
    eventKey: "request_approved",
    relatedDonation: donation._id,
    relatedRequest: request._id,
    dedupe: true,
  });

export const notifyNgoRequestRejected = (request, donation, reason) =>
  createNotification({
    receiver: request.ngo,
    title: "Donation Request Rejected",
    message: reason
      ? `Your request for "${donation.foodTitle}" was rejected. Reason: ${reason}`
      : `Your request for "${donation.foodTitle}" was rejected.`,
    type: "rejection",
    eventKey: "request_rejected",
    relatedDonation: donation._id,
    relatedRequest: request._id,
    dedupe: true,
  });

export default {
  notifyDonationPosted,
  notifyApprovedNgosDonationAvailable,
  notifyDonationUpdated,
  notifyDonationCancelled,
  notifyDonationExpired,
  notifyDonationBooked,
  notifyDonationCollected,
  notifyDonationRequested,
  notifyNgoVerificationApproved,
  notifyNgoVerificationRejected,
  notifyNgoRequestApproved,
  notifyNgoRequestRejected,
};
