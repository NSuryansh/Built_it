import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";
import { multerupload } from "../middlewares/multer.middleware.js";
import fs from "fs";
import { getOAuthClient } from "../utils/google.js";
import { decrypt } from "../utils/encryption.js";
import { google } from "googleapis";
dotenv.config();

const docRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
const SECRET_KEY = process.env.JWT_SECRET_KEY;

cloudinary.config({
  cloud_name: "dt7a9meug",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(path) {
  const results = await cloudinary.uploader.upload(path);
  return results["url"];
}

docRouter.post("/login", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  const doctor = await prisma.doctor.findUnique({ where: { email: email } });
  if (!doctor) {
    return res.status(401).json({ message: "Email ID is not registered" });
  }
  const match = await bcrypt.compare(password, doctor.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign(
    {
      userId: doctor.id,
      username: doctor.name,
      email: doctor.email,
      role: "doc",
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  res.json({ message: "Login successful", token });
});

docRouter.post("/forgotPassword", async (req, res) => {
  const email = req.body["email"];
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        email: email,
      },
    });
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: doctor.id,
      },
    });
    const resetLink = `https://wellness.iiti.ac.in/doctor/reset_password?token=${token}`;
    const subject = "Reset Your Password";
    const message = `Click the following link to reset your password. This link is valid for 15 minutes:\n\n${resetLink}`;
    sendEmail(doctor.email, subject, message);
    res.json({
      message:
        "Password reset token generated. Check your email for instructions.",
    });
  } catch (e) {
    res.json(e);
  }
});

docRouter.post("/resetPassword", async (req, res) => {
  const token = req.body["token"];
  const password = req.body["password"];
  try {
    const resetEntry = await prisma.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });
    if (!resetEntry || new Date() > resetEntry.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.doctor.update({
      where: { id: resetEntry.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token: token },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

docRouter.get("/getUserById", authorizeRoles("doc"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const userId = Number(req.query["userId"]);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ user: user, message: "User found" });
  } catch (e) {
    return res.status(400).json({ message: "User not found" });
  }
});

docRouter.get(
  "/getAppointmentForDoctorUser",
  authorizeRoles("doc"),
  async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
    try {
      const userId = Number(req.query["userId"]);
      const docId = Number(req.query["docId"]);
      const appointments = await prisma.pastAppointments.findMany({
        where: { user_id: userId, doc_id: docId },
        orderBy: { createdAt: "desc" },
      });
      res.json({ appointments: appointments });
    } catch (e) {
      return res.status(400).json({ message: "Error in appointments" });
    }
  },
);

docRouter.post("/reschedule", async (req, res) => {
  const { id, username, docName, origTime, newTime, email } = req.body;
  try {
    const reschedule = await prisma.requests.update({
      where: { id: Number(id) },
      data: {
        dateTime: new Date(newTime),
        forDoctor: false,
      },
    });

    await sendEmail(
      email,
      "Appointment Reschedule",
      `Dear ${username},
Your appointment with ${docName} at ${origTime} has been rescheduled.
New Date: ${newTime}
Regards  
Calm Connect`,
    );
    res.json(reschedule);
  } catch (e) {
    console.error(e);
    if (e.code === "P2025") {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(400).json({ error: e.message });
  }
});

docRouter.post("/addLeave", authorizeRoles("doc"), async (req, res) => {
  const doc_id = Number(req.body["doc_id"]);
  if (doc_id !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const start = req.body["start"];
  const end = req.body["end"];

  const leave = await prisma.doctorLeave.create({
    data: {
      doctor_id: doc_id,
      date_start: start,
      date_end: end,
    },
  });

  res.json(leave);
});

docRouter.get("/reqApp", authorizeRoles("doc"), async (req, res) => {
  const docId = Number(req.query["docId"]);
  if (docId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const appt = await prisma.requests.findMany({
    where: { doctor_id: docId },
    include: {
      user: {
        select: {
          username: true,
          alt_mobile: true,
          mobile: true,
          email: true,
        },
      },
    },
  });
  res.json(appt);
});

docRouter.post("/emergencyBook", authorizeRoles("doc"), async (req, res) => {
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
  const dateTime = req.body["dateTime"];
  const date = new Date();
  const newDate = new Date(dateTime);
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const some = new Date(newDate.getTime() - userTimezoneOffset);
  const reason = req.body["reason"];
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const appointment = await prisma.appointments.create({
        data: {
          user_id: userId,
          doctor_id: doctorId,
          dateTime: some,
          reason: reason,
          isDoctor: true,
          isEmergency: true,
        },
      });

      return { appointment };
    });

    await sendEmail(
      user.email,
      "Emergency Appointment Scheduled!",
      `Dear ${user.username}, \n\nThis is to inform you that an EMERGENCY appointment has been scheduled with ${doctor.name}.\n\nThe details of the appointment are given below: \n\nDate: ${new Date(
        some,
      ).toDateString()}\nTime: ${new Date(some).toTimeString()}\nVenue: ${
        doctor.office_address
      }\n\nRegards\nCalm Connect`,
    );

    await sendEmail(
      doctor.email,
      "Emergency Appointment Scheduled",
      `Dear ${doctor.name}, \n\nYour emergency appointment with ${
        user.username
      } has been scheduled. The details of the appointment are given below: \n\nDate: ${new Date(
        some,
      ).toDateString()}\nTime: ${new Date(some).toTimeString()}\nVenue: ${
        doctor.office_address
      }\n\nRegards\nCalm Connect`,
    );

    res.json({ message: "Emergency Appointment booked successfully", result });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

docRouter.get("/profile", authorizeRoles("doc"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const doctor = await prisma.doctor.findUnique({
      where: { email: decoded.email },
    });
    res.json(
      JSON.parse(JSON.stringify({ doctor: doctor, message: "Doctor found" })),
    );
  } catch (e) {
    console.error(e);
  }
});

docRouter.post("/changeRoomNo", authorizeRoles("doc"), async (req, res) => {
  try {
    const user_Id = Number(req.query["user_Id"]);
    const room_no = req.query["roomNo"];

    // Validate input
    if (!user_Id || !room_no) {
      return res.status(400).json({ error: "ID and room number is required" });
    }

    // Delete the notification from the database
    const changeRoom = await prisma.user.update({
      where: { id: user_Id },
      data: { roomNo: room_no },
    });

    res.json({ message: "Room number updated successfully", changeRoom });
  } catch (error) {
    console.error("Error changing room number: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

docRouter.get("/currentdocappt", authorizeRoles("doc"), async (req, res) => {
  const doctorId = Number(req.query["doctorId"]);
  // Get today's date range (start and end of today)
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // const appt = await prisma.appointments.findMany({
    //   where: { doctor_id: doctorId },
    // });
    const appt = await prisma.appointments.findMany({
      where: { doctor_id: doctorId },
      orderBy: { dateTime: "asc" },
      include: {
        user: {
          select: {
            username: true, // assuming "name" is the username
            alt_mobile: true,
            mobile: true,
            email: true,
          },
        },
      },
    });

    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching current appointments" });
  }
});

docRouter.get("/pastdocappt", authorizeRoles("doc"), async (req, res) => {
  const doctorId = Number(req.query["doctorId"]);
  // Get today's date range (start and end of today)
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const appt = await prisma.pastAppointments.findMany({
      where: { doc_id: doctorId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

docRouter.get("/uniquePatients", authorizeRoles("doc"), async (req, res) => {
  const doctorId = Number(req.query["doctorId"]);
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appt = await prisma.pastAppointments.findMany({
      where: { doc_id: doctorId },
      distinct: ["user_id"],
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(appt);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

docRouter.get("/getFeelings", authorizeRoles("doc"), async (req, res) => {
  try {
    const feelings = await prisma.feelings.findMany({
      include: {
        user: true,
      },
    });

    if (!feelings) {
      return res.status(404).json({ message: "No feelings found" });
    }
    res.status(200).json(feelings);
  } catch (error) {
    console.error("Error fetching feelings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

docRouter.get("/general-slots", authorizeRoles("doc"), async (req, res) => {
  const { docId } = req.query;
  if (docId !== req.user.userId.toString()) {
    return res.status(403).json({ error: "Access denied" });
  }
  const doctor_id = Number(docId);

  try {
    let generalSlots = await prisma.slots.findMany({
      where: { doctor_id: doctor_id },
    });
    res.json({ generalSlots });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Couldn't fetch the slots" });
  }
});

docRouter.put("/modifySlots", authorizeRoles("doc"), async (req, res) => {
  const { slotsArray, doctorId } = req.query;
  if (doctorId !== req.user.userId.toString()) {
    return res.status(403).json({ error: "Access denied" });
  }

  const slots = JSON.parse(slotsArray);
  try {
    const delSlots = await prisma.slots.deleteMany({
      where: {
        doctor_id: Number(doctorId),
      },
    });
    for (let i = 0; i < slots.length; i++) {
      const newSlots = await prisma.slots.create({
        data: {
          doctor_id: Number(doctorId),
          starting_time: new Date(slots[i].time),
          day_of_week: slots[i].day_of_week,
        },
      });
    }
    res.json({ message: "Doctor slots updated successfully" });
  } catch (e) {
    console.error(e);
    res.json(e);
  }
});

docRouter.put(
  "/modifyDoc",
  authorizeRoles("doc"),
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        id,
        address,
        office_address,
        experience,
        additionalExperience,
        educ,
        certifi,
        isProfileDone,
        desc,
      } = req.body;
      if (id !== req.user.userId.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }
      const file = req.file;
      var url = null;
      if (file) {
        url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          });
          stream.end(file.buffer);
        });
      }

      // const doc_id = Number(id);
      const certifications = certifi.split(",");
      const education = educ.split(",");
      const doctorId = Number(id);
      const doc_id = doctorId;
      if (isNaN(doctorId) || doctorId <= 0) {
        return res.status(400).json({ error: "Invalid doctor ID" });
      }

      const existingDoctor = await prisma.doctor.findUnique({
        where: {
          id: doctorId,
        },
      });
      if (existingDoctor && existingDoctor.id !== doctorId) {
        return res
          .status(400)
          .json({ error: "The updated field is already in use" });
      }

      const updatedData = {};
      if (address?.trim()) updatedData.address = address.trim();
      if (office_address?.trim())
        updatedData.office_address = office_address.trim();
      if (desc?.trim()) updatedData.desc = desc.trim();
      if (experience != null) updatedData.experience = experience.trim();
      if (additionalExperience?.trim())
        updatedData.additionalExperience = additionalExperience.trim();

      if (url) updatedData.img = url;
      if (isProfileDone) updatedData.isProfileDone = isProfileDone;
      updatedData.isProfileDone = isProfileDone === "true";
      if (Object.keys(updatedData).length === 0) {
        return res
          .status(400)
          .json({ error: "No valid fields provided for update." });
      }

      try {
        const updatedDoctor = await prisma.doctor.update({
          where: { id: doctorId },
          data: updatedData,
        });

        const certificate = await prisma.docCertification.deleteMany({
          where: {
            doctor_id: doc_id,
          },
        });
        for (const certif of certifications) {
          await prisma.docCertification.create({
            data: {
              doctor_id: doc_id,
              certification: certif,
            },
          });
        }
        const edu = await prisma.docEducation.deleteMany({
          where: {
            doctor_id: doc_id,
          },
        });
        for (const educ of education) {
          await prisma.docEducation.create({
            data: {
              doctor_id: doc_id,
              education: educ,
            },
          });
        }
        res.json({ message: "Doctor updated successfully", updatedDoctor });
      } catch (error) {
        if (error.code === "P2025") {
          return res.status(404).json({ error: "Doctor not found" });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error updating Doctor: ", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },
);

docRouter.post("/add-slot", authorizeRoles("doc"), async (req, res) => {
  const doctorId = req.body["doctorId"];
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const startTime = req.body["startTime"];
  try {
    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newSlot = await prisma.slots.create({
      data: {
        doctor_id: doctorId,
        starting_time: startTime,
      },
    });

    res.json({ message: "Slot Added Successfully", newSlot });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

docRouter.get("/getDocs", authorizeRoles("doc"), async (req, res) => {
  const { doc_id } = req.query;

  try {
    const docs = await prisma.doctor.findMany({
      where: { id: { not: Number(doc_id) } },
      select: {
        name: true,
        email: true,
        id: true,
      },
    });

    res.status(200).json(docs);
  } catch (error) {
    console.error("Error while fetching doctors:", error);
    res.status(500).json({
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
});

docRouter.post("/create-referral", authorizeRoles("doc"), async (req, res) => {
  const { roll_no, referred_by, referred_to, reason } = req.body;

  if (!roll_no || !referred_by || !referred_to || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Step 1: Find user by roll number
  const user = await prisma.user.findUnique({
    where: {
      rollNo: roll_no, // make sure rollNo matches the field in your Prisma schema
    },
  });

  if (user === null) {
    return res
      .status(404)
      .json({ message: "User with given roll number not found" });
  }

  const user_id = user.id;
  try {
    const newReferral = await prisma.referrals.create({
      data: {
        user_id: user_id,
        doctor_id: Number(referred_to),
        referred_by: referred_by,
        username: user.username,
        reason: reason,
      },
    });

    await prisma.appointments.updateMany({
      where: { user_id: user_id },
      data: { doctor_id: Number(referred_to) },
    });

    await prisma.pastAppointments.updateMany({
      where: { user_id: user_id },
      data: { doc_id: Number(referred_to) },
    });

    res.status(201).json({
      message: "Referral added successfully",
      referral: newReferral,
    });
  } catch (error) {
    console.error("Error adding referral:", error);
    res.status(500).json({
      message: "Failed to add referral",
      error: error.message,
    });
  }
});

docRouter.get("/get-referrals", authorizeRoles("doc"), async (req, res) => {
  const { doctor_id } = req.query;

  if (doctor_id != req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const data = await prisma.referrals.findMany({
      where: { doctor_id: Number(doctor_id) },
    });

    res.status(200).json({
      message: "All referrals displayed succesfully",
      referrals: data,
    });
  } catch (error) {
    console.error("Error fetching referrals: ", error);
    res.status(500).json({
      message: "Failed to fetch referrals",
      error: error.message,
    });
  }
});
// In routes/doctor.route.js

docRouter.post(
  "/deleteApp",
  authorizeRoles("doc"),
  multerupload.array("files", 10),
  async (req, res) => {
    try {
      const appId = Number(req.body.appId);
      const doc_id = Number(req.body.doctorId);
      const user_id = Number(req.body.userId);
      const note = req.body.note;
      const category = req.body.category;
      // Get the explicit status sent from frontend
      const statusAction = req.body.statusAction;

      const dateTime = new Date();

      if (!note || !category) {
        return res.status(400).json({ error: "All fields required" });
      }

      if (doc_id !== req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      // 1. Fetch current appointment to check existing status
      const currentApp = await prisma.appointments.findUnique({
        where: { id: appId },
      });

      // 2. Determine Final Status
      // If closing, set to CLOSED.
      // If marking as done, keep existing status (NEW or OPEN)
      const finalStatus =
        statusAction === "CLOSED" ? "CLOSED" : currentApp?.caseStatus || "OPEN";

      const files = req.files || [];
      const doc = await prisma.doctor.findUnique({ where: { id: doc_id } });

      if (!doc.driveFolderId) {
        return res.status(400).json({
          error: "Therapist drive folder not configured",
        });
      }

      const oauth2Client = getOAuthClient();
      oauth2Client.setCredentials({
        refresh_token: decrypt(doc.googleRefreshToken),
      });

      const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });

      const folder = await drive.files.create({
        requestBody: {
          name: dateTime.toISOString().replace(/[:.]/g, "-"),
          mimeType: "application/vnd.google-apps.folder",
          parents: [doc.driveFolderId],
        },
        fields: "id, webViewLink",
      });

      /* ---------- UPLOAD FILES ---------- */
      for (const file of files) {
        try {
          await drive.files.create({
            requestBody: {
              name: file.originalname,
              parents: [folder.data.id],
            },
            media: {
              mimeType: file.mimetype,
              body: fs.createReadStream(file.path),
            },
          });
        } finally {
          await fs.promises.unlink(file.path);
        }
      }

      await prisma.appointments.delete({
        where: { id: appId },
      });

      await prisma.pastAppointments.create({
        data: {
          note,
          doc_id,
          user_id,
          category,
          pdfLink: folder.data.webViewLink,
          createdAt: dateTime,
          caseStatus: finalStatus, // ✅ Save status
          isEmergency: currentApp?.isEmergency || false, // Preserve emergency flag
        },
      });

      res.json({ message: "Appointment done" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// --- 1. WELLNESS ARTICLES ---

docRouter.post("/add-article", authorizeRoles("doc"), async (req, res) => {
  try {
    const { title, description, url, source, readTime, iconName } = req.body;
    const article = await prisma.wellnessArticle.create({
      data: { title, description, url, source, readTime, iconName },
    });
    res.json({ message: "Article added successfully", article });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to add article" });
  }
});

docRouter.get("/get-articles", async (req, res) => {
  try {
    const articles = await prisma.wellnessArticle.findMany();
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

docRouter.put(
  "/update-article/:id",
  authorizeRoles("doc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, url, source, readTime, iconName } = req.body;
      const updated = await prisma.wellnessArticle.update({
        where: { id: Number(id) },
        data: { title, description, url, source, readTime, iconName },
      });
      res.json({ message: "Article updated", updated });
    } catch (e) {
      res.status(500).json({ error: "Failed to update article" });
    }
  },
);

docRouter.delete(
  "/delete-article/:id",
  authorizeRoles("doc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.wellnessArticle.delete({ where: { id: Number(id) } });
      res.json({ message: "Article deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  },
);

// --- 2. WELLNESS VIDEOS ---

docRouter.post("/add-video", authorizeRoles("doc"), async (req, res) => {
  try {
    const { sectionTitle, title, description, youtubeUrl } = req.body;
    const video = await prisma.wellnessVideo.create({
      data: { sectionTitle, title, description, youtubeUrl },
    });
    res.json({ message: "Video added successfully", video });
  } catch (e) {
    res.status(500).json({ error: "Failed to add video" });
  }
});

docRouter.get("/get-videos", async (req, res) => {
  try {
    const videos = await prisma.wellnessVideo.findMany();
    // Group videos by sectionTitle
    const groupedVideos = videos.reduce((acc, video) => {
      const section = acc.find((s) => s.title === video.sectionTitle);
      if (section) {
        section.videos.push(video);
      } else {
        acc.push({
          title: video.sectionTitle,
          description: "Curated videos",
          videos: [video],
        });
      }
      return acc;
    }, []);
    res.json(groupedVideos);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

docRouter.put("/update-video/:id", authorizeRoles("doc"), async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionTitle, title, description, youtubeUrl } = req.body;
    const updated = await prisma.wellnessVideo.update({
      where: { id: Number(id) },
      data: { sectionTitle, title, description, youtubeUrl },
    });
    res.json({ message: "Video updated", updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update video" });
  }
});

docRouter.delete(
  "/delete-video/:id",
  authorizeRoles("doc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.wellnessVideo.delete({ where: { id: Number(id) } });
      res.json({ message: "Video deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete video" });
    }
  },
);

// --- 3. ENTERTAINMENT ---

docRouter.post(
  "/add-entertainment",
  authorizeRoles("doc"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { type, category, title, link } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ error: "Image is required" });

      // Upload to Cloudinary
      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        stream.end(file.buffer);
      });

      const item = await prisma.entertainmentItem.create({
        data: { type, category, title, link, imageUrl },
      });
      res.json({ message: "Entertainment item added", item });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to add item" });
    }
  },
);

docRouter.get("/get-entertainment", async (req, res) => {
  try {
    const items = await prisma.entertainmentItem.findMany();

    const groupedData = items.reduce((acc, item) => {
      const typeKey = item.type;
      if (!acc[typeKey]) {
        acc[typeKey] = [];
      }
      acc[typeKey].push(item);
      return acc;
    }, {});

    res.json(groupedData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch entertainment items" });
  }
});

docRouter.put(
  "/update-entertainment/:id",
  authorizeRoles("doc"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type, category, title, link } = req.body;
      const file = req.file;

      let updateData = { type, category, title, link };

      if (file) {
        const imageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          });
          stream.end(file.buffer);
        });
        updateData.imageUrl = imageUrl;
      }

      const updated = await prisma.entertainmentItem.update({
        where: { id: Number(id) },
        data: updateData,
      });
      res.json({ message: "Item updated", updated });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to update item" });
    }
  },
);

docRouter.delete(
  "/delete-entertainment/:id",
  authorizeRoles("doc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.entertainmentItem.delete({ where: { id: Number(id) } });
      res.json({ message: "Item deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  },
);

docRouter.get(
  "/fetchCancelledAppoinments",
  authorizeRoles("doc"),
  async (req, res) => {
    try {
      const docId = Number(req.query["doctorId"]);
      // if (docId !== req.user.userId) {
      //   return res.status(403).json({ error: "Access denied" });
      // }
      const app = await prisma.cancelledRequest.findMany({
        where: {
          doctor_id: docId,
        },
        include: {
          user: {
            select: {
              username: true,
              alt_mobile: true,
              mobile: true,
              email: true,
            },
          },
        },
      });
      res.json(app);
    } catch (e) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  },
);

export default docRouter;
