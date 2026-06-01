import multer from "multer";

const allowedDocumentTypes = ["application/pdf", "image/jpeg", "image/png"];
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!allowedDocumentTypes.includes(file.mimetype)) {
    cb(new Error("Only PDF, JPG, and PNG documents are allowed"));
    return;
  }

  cb(null, true);
};

export const uploadNgoDocument = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"));
    return;
  }

  cb(null, true);
};

export const uploadDonationImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
