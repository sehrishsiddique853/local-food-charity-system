import multer from "multer";

const allowedDocumentTypes = ["application/pdf", "image/jpeg", "image/png"];

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
