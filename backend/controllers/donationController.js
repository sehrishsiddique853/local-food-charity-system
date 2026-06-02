import Donation from "../models/Donation.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/apiResponse.js";
import { FIXED_SERVICE_CITY } from "../constants/location.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import {
  notifyDonationCancelled,
  notifyDonationExpired,
  notifyDonationPosted,
  notifyDonationUpdated,
} from "../services/notificationService.js";

const ensureDonorOwnsDonation = (donation, userId) => {
  if (!donation) {
    throw new ApiError(404, "DONATION_NOT_FOUND", "Donation not found");
  }

  if (donation.donor.toString() !== userId.toString()) {
    throw new ApiError(403, "FORBIDDEN", "You can only access your own donations");
  }
};

const ensureDonationIsAvailable = (donation) => {
  if (donation.status !== "available") {
    throw new ApiError(
      400,
      "DONATION_NOT_EDITABLE",
      "Only available donations can be edited or cancelled"
    );
  }
};

const ensureDonationCanBeCancelled = (donation) => {
  if (["booked", "collected", "completed"].includes(donation.status)) {
    throw new ApiError(
      400,
      "DONATION_NOT_CANCELLABLE",
      "Booked or collected donations cannot be cancelled"
    );
  }
};

const markExpiredDonations = async (donorId = null) => {
  const filter = {
    status: { $in: ["available", "requested"] },
    expiryDate: { $lte: new Date() },
    isActive: true,
  };

  if (donorId) {
    filter.donor = donorId;
  }

  const expiringDonations = await Donation.find(filter).select("_id donor foodTitle");

  await Donation.updateMany(filter, {
    $set: {
      status: "expired",
      isActive: false,
    },
  });

  await Promise.all(expiringDonations.map((donation) => notifyDonationExpired(donation)));
};

const uploadDonationImagesToCloudinary = async (files = []) => {
  if (!files.length) {
    return [];
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, {
      folder: "local-food-charity/donation-images",
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
      resource_type: "image",
    }))
  );

  return uploadedImages.map((image) => image.secure_url);
};

export const createDonation = async (req, res, next) => {
  try {
    const imageUrls = await uploadDonationImagesToCloudinary(req.files);

    const donation = await Donation.create({
      donor: req.user.id,
      foodTitle: req.body.foodTitle,
      foodType: req.body.foodType,
      quantity: {
        value: req.body.quantity.value,
        unit: req.body.quantity.unit,
      },
      description: req.body.description,
      pickupAddress: {
        city: FIXED_SERVICE_CITY,
        address: req.body.pickupAddress.address,
      },
      expiryDate: req.body.expiryDate,
      images: imageUrls,
      status: "available",
      isActive: true,
    });

    await notifyDonationPosted(donation);

    return successResponse(res, 201, {
      message: "Donation posted successfully",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const getMyDonations = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const donations = await Donation.find({
      donor: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, { donations });
  } catch (err) {
    return next(err);
  }
};

export const getDonationHistory = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const donations = await Donation.find({
      donor: req.user.id,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, { donations });
  } catch (err) {
    return next(err);
  }
};

export const getDonationById = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const donation = await Donation.findById(req.params.id);
    ensureDonorOwnsDonation(donation, req.user.id);

    return successResponse(res, 200, { donation });
  } catch (err) {
    return next(err);
  }
};

export const updateDonation = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const donation = await Donation.findById(req.params.id);
    ensureDonorOwnsDonation(donation, req.user.id);
    ensureDonationIsAvailable(donation);

    const imageUrls = await uploadDonationImagesToCloudinary(req.files);

    if (req.body.foodTitle !== undefined) donation.foodTitle = req.body.foodTitle;
    if (req.body.foodType !== undefined) donation.foodType = req.body.foodType;
    if (req.body.description !== undefined) donation.description = req.body.description;
    if (req.body.expiryDate !== undefined) donation.expiryDate = req.body.expiryDate;

    if (req.body.quantity?.value !== undefined) donation.quantity.value = req.body.quantity.value;
    if (req.body.quantity?.unit !== undefined) donation.quantity.unit = req.body.quantity.unit;

    if (req.body.pickupAddress?.address !== undefined) {
      donation.pickupAddress.address = req.body.pickupAddress.address;
      donation.pickupAddress.city = FIXED_SERVICE_CITY;
    }

    if (imageUrls.length) {
      donation.images = imageUrls;
    }

    await donation.save();
    await notifyDonationUpdated(donation);

    return successResponse(res, 200, {
      message: "Donation updated successfully",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteDonation = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const donation = await Donation.findById(req.params.id);
    ensureDonorOwnsDonation(donation, req.user.id);
    ensureDonationCanBeCancelled(donation);

    donation.status = "cancelled";
    donation.isActive = false;
    await donation.save();
    await notifyDonationCancelled(donation);

    return successResponse(res, 200, {
      message: "Donation cancelled successfully",
      donation,
    });
  } catch (err) {
    return next(err);
  }
};

export const getMyDonationStats = async (req, res, next) => {
  try {
    await markExpiredDonations(req.user.id);

    const statuses = ["available", "requested", "booked", "collected"];
    const groupedStats = await Donation.aggregate([
      {
        $match: {
          donor: req.user.id,
          status: { $in: statuses },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      total: 0,
      available: 0,
      requested: 0,
      booked: 0,
      collected: 0,
    };

    groupedStats.forEach((item) => {
      stats[item._id] = item.count;
      stats.total += item.count;
    });

    return successResponse(res, 200, stats);
  } catch (err) {
    return next(err);
  }
};
