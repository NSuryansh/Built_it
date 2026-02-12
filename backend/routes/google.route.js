// routes/google.js
import { Router } from "express";
import { google } from "googleapis";
import { encrypt } from "../utils/encryption.js";
import { getOAuthClient } from "../utils/google.js";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";

const googleRouter = Router();

googleRouter.get("/connect", authorizeRoles("doc"), async (req, res) => {
  const oauth2Client = getOAuthClient();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
    state: req.user.userId.toString(),
  });
  //   console.log(url);
  res.json({ url });
});

googleRouter.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const oauth2Client = getOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    // Create dedicated folder
    const folder = await drive.files.create({
      requestBody: {
        name: "IITI Counselling Notes",
        mimeType: "application/vnd.google-apps.folder",
      },
    });

    await prisma.doctor.update({
      where: { id: parseInt(state) },
      data: {
        googleRefreshToken: encrypt(tokens.refresh_token),
        driveFolderId: folder.data.id,
        googleDriveLinked: true,
      },
    });

    // Redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/doctor/profile`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/doctor/profile`);
  }
});

export default googleRouter;
