import Donation from "../models/Donation.js";
import DonationRequest from "../models/DonationRequest.js";

const terminalStatuses = ["collected", "completed", "expired"];

export const syncDonationStatuses = async (filter = {}) => {
  const donations = await Donation.find({
    ...filter,
    isActive: true,
    status: { $nin: terminalStatuses },
  })
    .select("_id status bookedByNgo")
    .lean();

  if (!donations.length) {
    return;
  }

  const donationIds = donations.map((donation) => donation._id);

  const [approvedRequests, pendingDonationIds] = await Promise.all([
    DonationRequest.find({
      donation: { $in: donationIds },
      requestStatus: "approved",
    })
      .select("donation ngo")
      .sort({ updatedAt: -1 })
      .lean(),
    DonationRequest.distinct("donation", {
      donation: { $in: donationIds },
      requestStatus: "pending",
    }),
  ]);

  const approvedByDonation = new Map();
  approvedRequests.forEach((request) => {
    const donationId = request.donation.toString();
    if (!approvedByDonation.has(donationId)) {
      approvedByDonation.set(donationId, request);
    }
  });

  const pendingDonationIdSet = new Set(
    pendingDonationIds.map((donationId) => donationId.toString())
  );

  const updates = donations.reduce((operations, donation) => {
    const donationId = donation._id.toString();
    const approvedRequest = approvedByDonation.get(donationId);

    if (approvedRequest) {
      const bookedByNgo = donation.bookedByNgo?.toString();
      const approvedNgo = approvedRequest.ngo.toString();

      if (donation.status !== "booked" || bookedByNgo !== approvedNgo) {
        operations.push({
          updateOne: {
            filter: { _id: donation._id },
            update: {
              $set: {
                status: "booked",
                bookedByNgo: approvedRequest.ngo,
              },
            },
          },
        });
      }

      return operations;
    }

    if (pendingDonationIdSet.has(donationId) && donation.status === "available") {
      operations.push({
        updateOne: {
          filter: { _id: donation._id },
          update: { $set: { status: "requested" } },
        },
      });
      return operations;
    }

    if (!pendingDonationIdSet.has(donationId) && donation.status === "requested") {
      operations.push({
        updateOne: {
          filter: { _id: donation._id },
          update: {
            $set: { status: "available" },
            $unset: { bookedByNgo: "" },
          },
        },
      });
    }

    return operations;
  }, []);

  if (updates.length) {
    await Donation.bulkWrite(updates);
  }
};
