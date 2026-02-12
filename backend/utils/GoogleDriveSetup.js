import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// export const drive = google.drive({
//   version: "v3",
//   auth,
// });

// drive-auth-impersonate.js
import { google } from "googleapis";
import key from "./service-account.json" assert { type: "json" }; // or require()

export async function getDriveAsUser(userEmail) {
  const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ["https://www.googleapis.com/auth/drive"],
    userEmail // <-- IMPORTANT: impersonate this user
  );

  await jwtClient.authorize(); // ensures token is there
  return google.drive({ version: "v3", auth: jwtClient });
}

// inside your route when you have doc and user
export const drive = await getDriveAsUser("sse240021008@iiti.ac.in"); // e.g. the patient or an uploader account

// use drive in getOrCreateFolder / uploadFileToFolder functions

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
