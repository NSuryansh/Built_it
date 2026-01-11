import multer from "multer";
import fs from "fs";

const uploadDir = "./tmpUploads";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

export const multerupload = multer({ storage });
