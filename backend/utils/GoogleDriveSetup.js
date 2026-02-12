import { google } from "googleapis";
import fs from "fs";

const key = JSON.parse(
  fs.readFileSync(new URL("../service-account.json", import.meta.url))
);

export function getDriveAsUser(userEmail) {
  const jwtClient = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
    subject: userEmail, 
  });

  return google.drive({
    version: "v3",
    auth: jwtClient,
  });
}

// inside your route when you have doc and user
export const drive = getDriveAsUser("sse240021008@iiti.ac.in");

export const getOrCreateFolder = async (name, parentId) => {
  const res = await drive.files.list({
    q: `
      name = '${name.replace(/'/g, "\\'")}' and
      mimeType = 'application/vnd.google-apps.folder' and
      '${parentId}' in parents and
      trashed = false
    `,
    fields: "files(id, name)",
    supportsAllDrives: true,
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  const folder = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return folder.data.id;
};

export async function uploadFileToFolder(file, folderId) {
  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: file.originalname,
      parents: [folderId],
    },
    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    },
    fields: "id, webViewLink",
  });

  return res.data;
}
