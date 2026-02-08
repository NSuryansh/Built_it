import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";
dotenv.config();

const adminRouter = Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

adminRouter.put("/uploadURL", authorizeRoles("admin"), async (req, res) => {
  const { id, url } = req.query;
  const event_id = Number(id);
  try {
    const response = await prisma.events.update({
      where: {
        id: event_id,
      },
      data: {
        url: url,
      },
    });
    res.json({ message: "Successful" });
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error uploading url" });
  }
});

adminRouter.post("/addSlot", authorizeRoles("admin"), async (req, res) => {
  const doc_id = Number(req.body["doc_id"]);
  if (doc_id !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const slotTime = req.body["time"];
  const slot = await prisma.slots.create({
    data: {
      doctor_id: doc_id,
      starting_time: Date(slotTime),
    },
  });
  res.json(slot);
});

adminRouter.get("/case-stats", authorizeRoles("admin"), async (req, res) => {
  try {
    // 1. Fetch all doctors
    const doctors = await prisma.doctor.findMany({
      select: { id: true, name: true, email: true }
    });

    // 2. Aggregate stats from PastAppointments
    const stats = await prisma.pastAppointments.groupBy({
      by: ['doc_id', 'caseStatus'],
      _count: {
        _all: true
      }
    });

    // 3. Map stats to doctors
    const doctorStats = doctors.map(doc => {
      const docData = stats.filter(s => s.doc_id === doc.id);
      
      const newCases = docData.find(s => s.caseStatus === 'NEW')?._count._all || 0;
      const openCases = docData.find(s => s.caseStatus === 'OPEN')?._count._all || 0;
      const closedCases = docData.find(s => s.caseStatus === 'CLOSED')?._count._all || 0;

      return {
        ...doc,
        stats: {
          new: newCases,
          open: openCases,
          closed: closedCases,
          total: newCases + openCases + closedCases
        }
      };
    });

    res.json(doctorStats);
  } catch (error) {
    console.error("Error fetching case stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
adminRouter.post("/addDoc", authorizeRoles("admin"), async (req, res) => {
  const {
    name,
    mobile,
    email,
    password,
    reg_id,
    desc,
    address,
    office_address,
    experience,
    img,
    weekOff,
  } = req.body;

  try {
    const existingDoc = await prisma.doctor.findFirst({
      where: {
        OR: [{ email: email }, { mobile: mobile }, { reg_id: reg_id }],
      },
    });

    if (existingDoc) {
      return res.status(400).json({ 
        error: "Doctor with this Email, Mobile, or Reg ID already exists." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const doc = await prisma.doctor.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        reg_id,
        address,
        office_address,
        experience,
        desc,
        img,
        weekOff,
      },
    });
    
    res.json({ message: "doc added", doc });
  } catch (e) {
    console.error("Error adding doctor:", e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
});

adminRouter.post("/login", async (req, res) => {
  // console.log(req.body);
  const emailId = req.body["email"];
  const password = req.body["password"];

  const admin = await prisma.admin.findUnique({ where: { email: emailId } });
  if (!admin) {
    return res.status(401).json({ message: "User doesn't exist" });
  }
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign(
    {
      userId: admin.id,
      email: admin.email,
      mobile: admin.mobile,
      role: "admin",
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );

  res.json({ message: "Login successful", token });
});

adminRouter.post("/forgotPassword", async (req, res) => {
  const email = req.body["email"];
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    // console.log(admin);
    if (!admin) {
      res.json({ message: "No user admin with this email" });
    }
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: admin.id,
      },
    });
    // console.log(tokengen);
    const resetLink = `https://wellness.iiti.ac.in/admin/reset_password?token=${token}`;
    const subject = "Reset Your Password";
    const message = `Click the following link to reset your password. This link is valid for 15 minutes:\n\n${resetLink}`;
    sendEmail(admin.email, subject, message);
    res.json({
      message:
        "Password reset token generated. Check your email for instructions.",
    });
  } catch (e) {
    res.json(e);
  }
});

adminRouter.post("/resetPassword", async (req, res) => {
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
    await prisma.admin.update({
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

adminRouter.get("/profile", authorizeRoles("admin"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });
    // console.log(admin);
    res.json({ admin: admin, message: "Admin found" });
  } catch (e) {
    console.log(e);
  }
});

adminRouter.post("/toggleDoc", authorizeRoles("admin"), async (req, res) => {
  const doctorId = parseInt(req.body["doctorID"]);
  const isInactive = Boolean(req.body["isInactive"]);
  // console.log(doctorId);
  try {
    // Find the doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctorId || isNaN(doctorId)) {
      return res
        .status(404)
        .json({ error: "Doctor not found OR Invalid Doctor ID" });
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        isInactive: !isInactive,
      },
    });

    res.json({ message: "Doctor toggled successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/createAdmin", async (req, res) => {
  const name = req.body["name"];
  const email = req.body["email"];
  const password = req.body["password"];
  const mobile = req.body["mobile"];
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: {
      name: name,
      email: email,
      mobile: mobile,
      password: hashedPassword,
    },
  });
  res.json(admin);
});

adminRouter.get("/pastApp", authorizeRoles("admin"), async (req, res) => {
  const currDate = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(currDate.getFullYear() - 1);
  try {
    const pastApp = await prisma.pastAppointments.findMany({
      where: {
        createdAt: {
          gte: oneYear,
          lte: currDate,
        },
      },
      include: {
        user: true,
        doc: true,
      },
    });
    // console.log(pastApp);
    res.json(pastApp);
  } catch (e) {
    console.error(e);
    res.json(e);
  }
});

adminRouter.get(
  "/all-appointments",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      // Fetch upcoming/current appointments with related doctor and user
      const appts = await prisma.appointments.findMany({
        include: {
          doctor: true,
          user: true,
        },
      });

      // Fetch past appointments with related doctor and user
      const pastApp = await prisma.pastAppointments.findMany({
        include: {
          doc: true,
          user: true,
        },
      });

      res.status(200).json({
        message: "Fetched all appointment data",
        appts,
        pastApp,
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({
        message: "Failed to fetch appointment data",
        error: error.message,
      });
    }
  },
);

adminRouter.post("/referrals", authorizeRoles("admin"), async (req, res) => {
  const { roll_no, doctor_id, referred_by, reason } = req.body;

  if (!roll_no || !doctor_id || !referred_by || !reason) {
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
  const docId = Number(doctor_id);
  try {
    const newReferral = await prisma.referrals.create({
      data: {
        user_id: user_id,
        doctor_id: docId,
        referred_by: referred_by,
        username: user.username,
        reason: reason,
      },
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

adminRouter.get(
  "/appointments-count",
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const userId = Number(req.query["id"]);

      if (!userId) {
        return res.status(400).json({ error: "Invalid or missing user ID" });
      }

      const curr = await prisma.appointments.count({
        where: {
          user_id: userId,
        },
      });
      const past = await prisma.pastAppointments.count({
        where: {
          user_id: userId,
        },
      });
      const count = curr + past;
      res.status(200).json({
        message: `User ${userId} has ${count} appointments`,
        count,
      });
    } catch (error) {
      console.error("Error fetching appointment count:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

adminRouter.get("/user-doctors", authorizeRoles("admin"), async (req, res) => {
  try {
    const userId = Number(req.query["userId"]);

    if (!userId) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    // Get doctors from upcoming/current appointments
    const current = await prisma.appointments.findMany({
      where: { user_id: userId },
      include: { doctor: { select: { id: true, name: true } } },
    });

    // Get doctors from past appointments
    const past = await prisma.pastAppointments.findMany({
      where: { user_id: userId },
      include: {
        doc: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Extract all doctor objects from both
    const allDoctors = [
      ...current.map((a) => a.doctor),
      ...past.map((p) => p.doc),
    ].filter(Boolean); // remove any nulls (if some past don't have doctors)

    // Filter out duplicates by doctor id
    const uniqueDoctorsMap = new Map();
    allDoctors.forEach((doc) => {
      if (doc && !uniqueDoctorsMap.has(doc.id)) {
        uniqueDoctorsMap.set(doc.id, doc);
      }
    });

    const uniqueDoctors = Array.from(uniqueDoctorsMap.values());

    res.status(200).json({
      message: `User ${userId} has had appointments with ${uniqueDoctors.length} doctor(s)`,
      doctors: uniqueDoctors,
    });
  } catch (error) {
    console.error("Error fetching user doctors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/signup", async (req, res) => {
  const { email, password, name, mobile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.findUnique({ where: { email: email } });
  if (admin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const newAdmin = await prisma.admin.create({
    data: {
      name,
      email,
      mobile,
      password: hashedPassword,
    },
  });

  res.json({ message: "Register successful" });
});

export default adminRouter;
