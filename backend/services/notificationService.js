import Notification from "../models/Notification.js";

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

export default {
  notifyDonationPosted,
  notifyDonationUpdated,
  notifyDonationCancelled,
  notifyDonationExpired,
  notifyDonationBooked,
  notifyDonationCollected,
};
