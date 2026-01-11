import { exec } from "child_process";
import fs from "fs/promises";

const RCLONE_ROOT = "gdrive:/Wellness Notes";

function sanitize(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, "-").trim();
}

export function uploadToGoogleDrive(file, meta) {
  return new Promise((resolve, reject) => {
    const therapist = sanitize(meta.therapistName);
    const patient = sanitize(meta.patientName);
    const datetime = sanitize(meta.dateTime); // "2026-01-11 19-30"

    const remoteFolder = `${RCLONE_ROOT}/${therapist}/${patient}/${datetime}`;
    const remoteFilePath = `${remoteFolder}/${file.originalname}`;

    // Step 1: Create folder structure (safe even if exists)
    exec(`rclone mkdir "${remoteFolder}"`, (err) => {
      if (err) return reject(err);

      // Step 2: Upload file
      exec(`rclone copy "${file.path}" "${remoteFolder}"`, async (error) => {
        if (error) return reject(error);

        // Step 3: Generate shareable folder link
        exec(`rclone link "${remoteFolder}"`, async (err, stdout) => {
          if (err) return reject(err);

          const folderLink = stdout.trim();

          // Step 4: Delete temp file
          await fs.unlink(file.path);

          resolve({
            folder: remoteFolder,
            shareableLink: folderLink
          });
        });
      });
    });
  });
}
