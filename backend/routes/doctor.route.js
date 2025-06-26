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
  // console.log(req.body);
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
    }
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
    // console.log(doctor);
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: doctor.id,
      },
    });
    // console.log(tokengen);
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
      });
      // console.log(appointments);
      res.json({ appointments: appointments });
    } catch (e) {
      return res.status(400).json({ message: "Error in appointments" });
    }
  }
);

docRouter.post("/reschedule", authorizeRoles("doc"), async (req, res) => {
  const { id, docId, docName, origTime, newTime, email, username } = req.body;
  if (docId !== req.user.userId) {
    return res.status(400).json({ error: "Access denied" });
  }
  // console.log(id);
  try {
    await sendEmail(
      email,
      "Appointment Reschedule",
      `Dear ${username}, \n\nYour appointment with ${docName} at ${origTime} has to be rescheduled due to another engagement of the counsellor. You can book another appointment at the timings given below: \n\nDate: ${newTime}\n\nRegards\nIITI CalmConnect`
    );
    const reschedule = await prisma.requests.delete({ where: { id: id } });
    res.json(reschedule);
  } catch (e) {
    res.status(400).json(e);
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

docRouter.post("/book", authorizeRoles("doc"), async (req, res) => {
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const dateTime = req.body["dateTime"];
  const date = new Date();
  const newDate = new Date(dateTime);
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const some = new Date(newDate.getTime() - userTimezoneOffset);
  const reason = req.body["reason"];
  const appId = req.body["id"];
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
        },
      });

      const reqDel = await prisma.requests.delete({
        where: { id: parseInt(appId) },
      });

      return { appointment, reqDel };
    });

    await sendEmail(
      user.email,
      "Appointment Scheduled",
      `Dear ${user.username}, \n\nYour appointment with ${
        doctor.name
      } has been scheduled. The details of the appointment are given below: \n\nDate: ${some.getDate()}\nTime: ${some.getTime()}\nVenue: ${
        doctor.office_address
      }\n\nRegards\nIITI CalmConnect`
    );

    res.json({ message: "Appointment booked successfully", result });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

docRouter.get("/reqApp", authorizeRoles("doc"), async (req, res) => {
  const docId = Number(req.query["docId"]);
  if (docId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const appt = await prisma.requests.findMany({
    where: { doctor_id: docId, forDoctor: true },
    include: {
      user: {
        select: {
          username: true,
          mobile: true,
          email: true,
        },
      },
    },
  });
  // console.log(appt);
  res.json(appt);
});

docRouter.get("/profile", authorizeRoles("doc"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const doctor = await prisma.doctor.findUnique({
      where: { email: decoded.email },
    });
    // console.log(doctor);
    res.json(
      JSON.parse(JSON.stringify({ doctor: doctor, message: "Doctor found" }))
    );
  } catch (e) {
    console.error(e);
  }
});

docRouter.post("/changeRoomNo", authorizeRoles("doc"), async (req, res) => {
  try {
    const user_Id = Number(req.query["user_Id"]);
    const room_no = req.query["roomNo"];
    // console.log(room_no);

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

docRouter.post("/deleteApp", authorizeRoles("doc"), async (req, res) => {
  const appId = Number(req.body["appId"]);
  const doc_id = Number(req.body["doctorId"]);
  if (doc_id !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const user_id = Number(req.body["userId"]);
  const note = req.body["note"];
  const dateTime = new Date();
  // console.log(note);
  try {
    const deletedApp = await prisma.appointments.delete({
      where: {
        id: appId,
      },
    });
    // console.log(deletedApp);
    // console.log(dateTime);
    try {
      const pastApp = await prisma.pastAppointments.create({
        data: {
          note: note,
          doc_id: doc_id,
          user_id: user_id,
          createdAt: dateTime,
        },
      });
      // console.log(pastApp);
      res.json({ message: "Appointment done" });
    } catch (e) {
      res.json(e);
    }
  } catch (e) {
    res.json({ error: e });
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
      include: {
        user: {
          select: {
            username: true, // assuming "name" is the username
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
    // console.log("HH");
    const appt = await prisma.pastAppointments.findMany({
      where: { doc_id: doctorId },
      include: {
        user: true,
      },
    });
    // console.log(appt);
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
  // console.log(slotsArray);
  const slots = slotsArray.split(",");
  // console.log(doctorId);
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
          starting_time: new Date(slots[i]),
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
        educ,
        certifi,
        isProfileDone,
      } = req.body;

      if (id !== req.user.userId.toString()) {
        return res.status(403).json({ error: "Access denied" });
      }
      // console.log(req.body);
      const file = req.file;
      // console.log(file);
      // console.log(image)
      var url = null;
      if (file) {
        url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          });
          stream.end(file.buffer);
        });
        // console.log(url);
      }

      // const doc_id = Number(id);
      // console.log(req.query);
      const certifications = certifi.split(",");
      const education = educ.split(",");
      const doctorId = Number(id);
      const doc_id = doctorId;
      if (isNaN(doctorId) || doctorId <= 0) {
        return res.status(400).json({ error: "Invalid doctor ID" });
      }

      const orConditions = [];
      if (address) orConditions.push({ address });
      if (office_address) orConditions.push({ office_address });
      if (experience != "null") orConditions.push({ experience });

      const existingDoctor = await prisma.doctor.findUnique({
        where: {
          id: doctorId,
        },
      });
      // console.log(existingDoctor);
      if (existingDoctor && existingDoctor.id !== doctorId) {
        return res
          .status(400)
          .json({ error: "The updated field is already in use" });
      }
      // console.log(url);
      const updatedData = {};
      if (address?.trim()) updatedData.address = address.trim();
      if (office_address?.trim())
        updatedData.office_address = office_address.trim();
      if (experience != null) updatedData.experience = experience.trim();
      if (url) updatedData.img = url;
      if (isProfileDone) updatedData.isProfileDone = isProfileDone;
      updatedData.isProfileDone = isProfileDone === "true";
      // console.log(updatedData);
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

        // console.log(updatedDoctor);

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
  }
);

docRouter.post("/add-slot", authorizeRoles("doc"), async (req, res) => {
  const doctorId = req.body["doctorId"];
  if (doctorId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const startTime = req.body["startTime"];
  // console.log(req.body);
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

docRouter.get("/get-referrals", authorizeRoles("doc"), async (req, res) => {
  const { doctor_id } = req.query;
  if (doctor_id !== req.user.userId) {
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

docRouter.post("/request-to-user", authorizeRoles("doc"), async (req, res) => {
  const userId = Number(req.body["userId"]);
  const doctorId = Number(req.body["doctorId"]);
  if (doctorId.toString() !== req.user.userId.toString()) {
    return res.status(403).json({ error: "Access denied" });
  }
  const dateTime = req.body["dateTime"];
  const reason = req.body["reason"];

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const date = new Date(dateTime);
    // Create appointment
    const appointment = await prisma.requests.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
        dateTime: new Date(dateTime),
        reason: reason,
        forDoctor: false,
      },
    });
    // console.log(appointment);
    res.json({
      message: "Appointment requested successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

export default docRouter;
