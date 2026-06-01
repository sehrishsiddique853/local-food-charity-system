const normalizeDonationBody = (req, res, next) => {
  if (!req.body.quantity || typeof req.body.quantity !== "object") {
    req.body.quantity = {
      value: req.body.quantityValue || req.body.quantity,
      unit: req.body.quantityUnit || req.body.unit,
    };
  }

  if (!req.body.pickupAddress || typeof req.body.pickupAddress !== "object") {
    req.body.pickupAddress = {
      address: req.body.address || req.body.pickupAddressAddress || req.body.pickupAddress,
      city: req.body.city,
    };
  }

  if (!req.body.expiryDate && req.body.expiryTime) {
    req.body.expiryDate = req.body.expiryTime;
  }

  next();
};

export default normalizeDonationBody;
