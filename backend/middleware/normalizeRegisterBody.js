const normalizeRegisterBody = (req, res, next) => {
  if (typeof req.body.role === "string") {
    req.body.role = req.body.role.trim().toLowerCase();
  }

  if (!req.body.location && req.body.address) {
    req.body.location = {
      address: req.body.address,
    };
  }

  next();
};

export default normalizeRegisterBody;
