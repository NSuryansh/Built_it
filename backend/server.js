import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
// import emailjs from "@emailjs/browser";
import { error } from "console";
import axios from "axios";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const server = createServer(app);
const port = 3000;
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., smtp.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

app.use(cors());
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

cloudinary.config({
  cloud_name: "dt7a9meug",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(path) {
  const results = await cloudinary.uploader.upload(path);
  return results["url"];
}

const users = new Map();
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("register", ({ userId }) => {
    users.set(userId, socket.id);
    console.log(userId);
  });
  socket.on(
    "sendMessage",
    async ({
      senderId,
      recipientId,
      encryptedText,
      iv,
      encryptedAESKey,
      authTag,
    }) => {
      try {
        const message = await prisma.message.create({
          data: {
            senderId: parseInt(senderId),
            recipientId: parseInt(recipientId),
            encryptedText: encryptedText,
            iv: iv,
            encryptedAESKey,
            authTag,
          },
        });
        console.log(senderId, "message sent to", recipientId);
        if (users.has(recipientId)) {
          console.log(users.get(recipientId));
          io.to(users.get(recipientId)).emit("receiveMessage", {
            senderId,
            encryptedText,
            iv,
            encryptedAESKey,
            authTag,
          });
          console.log("Message sent");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  );
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
});

app.post("/signup", async (req, res) => {
  const username = req.body["username"];
  const email = req.body["email"];
  const mobile = req.body["mobile"];
  const password = req.body["password"];
  const altNo = req.body["altNo"];
  const pubKey = req.body["publicKey"];

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        mobile: mobile,
        email: email,
        password: hashedPassword,
        alt_mobile: altNo,
        publicKey: pubKey,
      },
    });
    res.status(201).json({ message: "User added" });
  } catch (e) {
    console.log(e);
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/modifyUser", async (req, res) => {
  try {
    const { id, username, email, mobile, alt_mobile } = req.body;

    console.log(req.body);

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      console.log(existingUsername);
      if (existingUsername && existingUsername.id !== Number(id)) {
        return res.status(400).json({ error: "Username is already in use" });
      }
    }

    if (mobile) {
      const existingMobile = await prisma.user.findUnique({
        where: { mobile },
      });
      if (existingMobile && existingMobile.id !== Number(id)) {
        return res
          .status(400)
          .json({ error: "Mobile Number is already in use" });
      }
    }

    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail && existingEmail.id !== Number(id)) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    const updatedData = {
      ...(username && { username }),
      ...(mobile && { mobile }),
      ...(email && { email }),
      ...(alt_mobile && { alt_mobile }),
    };

    // Ensure at least one field is being updated
    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

    // Update user details in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const username = req.body["username"];
  const password = req.body["password"];

  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    return res.status(401).json({ message: "User doesn't exists" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login successful", token });
});
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });
    console.log(user);
    res.json(JSON.parse(JSON.stringify({ user: user, message: "User found" })));
  } catch (e) {
    console.log(e);
  }
});

// app.post('/admin', async(req,res)=>{
//   const name = req.body["name"]
//   const email = req.body["email"]
//   const password = req.body["password"]
//   const mobile = req.body["mobile"]
//   const hashedPassword = await bcrypt.hash(password, 10)
//   const admin = await prisma.admin.create({
//     data:{
//       name: name,
//       email: email,
//       mobile: mobile,
//       password: hashedPassword
//     }
//   })
//   res.json(admin)
// })

app.get("/chatContacts", async (req, res) => {
  try {
    const userId = req.query["userId"];
    console.log(req.query["userId"]);
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const id = parseInt(userId);

    // Fetch all distinct users the given user has chatted with
    const chatPartners = await prisma.message.findMany({
      where: {
        OR: [{ senderId: id }, { recipientId: id }],
      },
      select: {
        senderId: true,
        recipientId: true,
      },
      distinct: ["senderId", "recipientId"],
    });

    // Extract unique user IDs excluding the current user
    const uniqueUserIds = new Set();
    chatPartners.forEach((chat) => {
      if (chat.senderId !== id) uniqueUserIds.add(chat.senderId);
      if (chat.recipientId !== id) uniqueUserIds.add(chat.recipientId);
    });

    // Fetch usernames of these users
    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(uniqueUserIds) },
      },
      select: {
        id: true,
        username: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const { userId, recId } = req.query;
    console.log(userId);
    console.log(recId);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId), recipientId: parseInt(recId) },
          { senderId: parseInt(recId), recipientId: parseInt(userId) },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    console.log(messages);
    res.json(messages);
  } catch (e) {
    console.log(e);
  }
});

app.post("/reschedule", async (req, res) => {
  const id = req.body["appId"];
  console.log(id);
  try {
    const reschedule = await prisma.requests.delete({ where: { id: id } });
    res.json(reschedule);
  } catch (e) {
    res.json(e);
  }
});

app.get("/getPastApp", async (req, res) => {
  const { docId } = req.query;
  try {
    const app = await prisma.pastAppointments.findMany({
      where: {
        doc_id: Number(docId),
      },
    });
    res.json(app);
  } catch (e) {
    res.json(e);
  }
});

app.get("/getPastEvents", async (req, res) => {
  try {
    console.log("hello");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await prisma.events.findMany({
      where: {
        dateTime: {
          gte: thirtyDaysAgo,
          lte: new Date(),
        },
      },
    });
    console.log(events);
    res.json(events);
  } catch (e) {
    res.json(e);
  }
});

// app.get('/public-key/:userId', async (req, res) => {
//     const { userId } = req.params;

//     const user = await prisma.user.findUnique({ where: { id: userId }, select: { publicKey: true } });

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ publicKey: user.publicKey });
// });

app.get("/events", async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      where: {
        dateTime: {
          gte: new Date(),
        },
      },
    }); // Fetch all events
    res.json(events); // Send the events as a JSON response
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error fetching events" });
  }
});

app.put("/updateUser", async (req, res) => {
  try {
    const { userId, username, mobile, email, alt_mobile } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedData = {
      ...(username && { username }),
      ...(mobile && { mobile }),
      ...(email && { email }),
      ...(alt_mobile && { alt_mobile }),
    };

    // Update the user details in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events", async (req, res) => {
  const id = req.body["id"];

  try {
    const resp = await prisma.events.delete({
      where: {
        id: id,
      },
    });
    res.json(resp);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/addDoc", async (req, res) => {
  const { name, mobile, email, password, reg_id, desc, img } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // const imgUrl = uploadImage(img)
  try {
    const doc = await prisma.doctor.create({
      data: {
        name: name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
        reg_id: reg_id,
        desc: desc,
        img: img,
      },
    });
    // const resp = await doc.json()
    // console.log(resp)
    res.json({ message: "doc added", doc: doc });
  } catch (e) {
    res.json({ error: e });
  }
});

app.post("/book", async (req, res) => {
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
  const dateTime = req.body["dateTime"];
  const reason = req.body["reason"];
  const appId = req.body["id"];
  console.log(req.body);
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

    // Create appointment
    const appointment = await prisma.appointments.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
        dateTime: new Date(dateTime),
        reason: reason,
      },
    });

    //Remove from requests table
    await prisma.requests.delete({ where: { id: parseInt(appId) } });

    res.json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

app.post("/requests", async (req, res) => {
  const userId = Number(req.body["userId"]);
  const doctorId = Number(req.body["doctorId"]);
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

    // Create appointment
    const appointment = await prisma.requests.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
        dateTime: new Date(dateTime),
        reason: reason,
      },
    });

    res.json({
      message: "Appointment request added successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

//GET REQUEST FOR DOCTOR LIST
app.get("/getdoctors", async (req, res) => {
  try {
    const docs = await prisma.doctor.findMany(); // Fetch all docs
    res.json(docs); // Send the docs as a JSON response
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error fetching doctors" });
  }
});

app.post("/docLogin", async (req, res) => {
  console.log(req.body);
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
    { userId: doctor.id, username: doctor.name, email: doctor.email },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login successful", token });
});

app.post("/adminLogin", async (req, res) => {
  console.log(req.body);
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
    { id: admin.id, email: admin.email, mobile: admin.mobile },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login successful", token });
});

app.get("/reqApp", async (req, res) => {
  const docId = Number(req.query["docId"]);
  const appt = await prisma.requests.findMany({
    where: { doctor_id: docId },
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
  res.json(appt);
});

app.get("/docProfile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const doctor = await prisma.doctor.findUnique({
      where: { email: decoded.email },
    });
    console.log(doctor);
    res.json(
      JSON.parse(JSON.stringify({ doctor: doctor, message: "Doctor found" }))
    );
  } catch (e) {
    console.log(e);
  }
});

app.get("/adminProfile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const admin = await prisma.admin.findUnique({
      where: { email: decoded.email },
    });
    console.log(admin);
    res.json({ admin: admin, message: "Admin found" });
  } catch (e) {
    console.log(e);
  }
});

app.post("/addEvent", async (req, res) => {
  try {
    const title = req.body["title"];
    const description = req.body["description"];
    const dateTime = req.body["dateTime"];
    const venue = req.body["venue"];

    // Validate required fields
    if (!title || !dateTime || !venue) {
      return res
        .status(400)
        .json({ error: "Title, DateTime, and Venue are required" });
    }

    // Create the event in Prisma
    const event = await prisma.events.create({
      data: {
        title: title,
        description: description,
        dateTime: new Date(dateTime), // Ensure it's a valid Date object
        venue: venue,
      },
    });

    res.json(event); // Return created event
  } catch (error) {
    console.error("Error adding event:", error);
    res.json({ error: "Internal server error" });
  }
});

app.post("/notifications", async (req, res) => {});

app.get("/notifications", async (req, res) => {
  try {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);
    const userId = req.query["userId"];

    await prisma.notifications.deleteMany({
      where: {
        user_id: userId,
        created_at: { lt: THIRTY_DAYS_AGO },
      },
    });

    const notifs = await prisma.notifications.findMany({
      where: {
        user_id: userId,
        created_at: { gte: THIRTY_DAYS_AGO },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(notifs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

app.delete("/deletenotifs", async (req, res) => {
  try {
    const userId = req.body["userID"];
    const chatUserId = req.body["chatUserID"];

    // Validate input
    if (!userId || !chatUserId) {
      return res
        .status(400)
        .json({ error: "User ID and ChatUser ID is required" });
    }

    // Delete the notification from the database
    const deletedNotif = await prisma.notifications.deleteMany({
      where: { user_id: userId, chat_user: chatUserId },
    });

    res.json({ message: "Notification deleted successfully", deletedNotif });
  } catch (error) {
    console.error("Error deleting notification: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deleteApp", async (req, res) => {
  const appId = Number(req.body["appId"]);
  const doc_id = Number(req.body["doctorId"]);
  const user_id = Number(req.body["userId"]);
  const note = req.body["note"];
  const dateTime = new Date();
  console.log(note);
  try {
    const deletedApp = await prisma.appointments.delete({
      where: {
        id: appId,
      },
    });
    console.log(deletedApp);
    console.log(dateTime);
    try {
      const pastApp = await prisma.pastAppointments.create({
        data: {
          note: note,
          doc_id: doc_id,
          user_id: user_id,
          createdAt: dateTime,
        },
      });
      console.log(pastApp);
      res.json({ message: "Appointment done" });
    } catch (e) {
      res.json(e);
    }
  } catch (e) {
    res.json({ error: e });
  }
});

app.delete("/deletedoc", async (req, res) => {
  const doctorId = parseInt(req.body["doctorID"]);

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

    // Start transaction to move and delete
    await prisma.$transaction([
      // Move to pastdoc table
      prisma.pastDoc.create({
        data: {
          id: doctor.id,
          name: doctor.name,
          mobile: doctor.mobile,
          email: doctor.email,
          reg_id: doctor.reg_id,
          removedAt: new Date(),
        },
      }),
      // Delete from doc table
      prisma.doctor.delete({
        where: { id: doctorId },
      }),
    ]);

    res.json({ message: "Doctor moved to PastDoc and deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/currentdocappt", async (req, res) => {
  const doctorId = Number(req.query["doctorId"]);
  // Get today's date range (start and end of today)
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
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

app.get("/pastdocappt", async (req, res) => {
  const doctorId = req.query["doctorId"];
  // Get today's date range (start and end of today)
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }
  try {
    const doctor = await prisma.Doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const appt = await prisma.pastAppointments.findMany({
      where: { doc_id: doctorId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

app.get("/pastuserappt", async (req, res) => {
  const userId = Number(req.query["userId"]);
  console.log(userId);
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const appt = await prisma.pastAppointments.findMany({
      where: { user_id: userId },
    }); // Fetch all appts
    console.log(appt);
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

app.get("/currentuserappt", async (req, res) => {
  const userId = Number(req.query["userId"]);
  // Get today's date range (start and end of today)
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const appt = await prisma.appointments.findMany({
      where: { user_id: userId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching current appointments" });
  }
});

app.get("/getfeelings", async (req, res) => {
  const userId = req.query["userId"]; // Fix: Use query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const feelings = await prisma.feelings.findUnique({
      where: { user_id: userId },
    });

    if (!feelings) {
      return res
        .status(404)
        .json({ message: "No feelings found for this user" });
    }

    res.status(200).json(feelings);
  } catch (error) {
    console.error("Error fetching feelings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/feelings", async (req, res) => {
  try {
    const { userId, menPeace, sleepQ, socLife, passion, lsScore, happyScore } =
      req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const feelings = await prisma.feelings.upsert({
      where: { user_id: userId },
      update: {
        mental_peace: menPeace,
        sleep_quality: sleepQ,
        social_life: socLife,
        passion: passion,
        less_stress_score: lsScore,
        happiness_score: happyScore,
      },
      create: {
        user_id: userId,
        mental_peace: menPeace,
        sleep_quality: sleepQ,
        social_life: socLife,
        passion: passion,
        less_stress_score: lsScore,
        happiness_score: happyScore,
      },
    });

    res.status(200).json(feelings);
  } catch (error) {
    console.error("Error adding/updating feelings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function sendEmail(to, subject, text) {
  // var params = {
  //   email: email,
  //   resetLink: link
  // }
  // emailjs
  //     .send("service_coucldi", "template_7iypoq7", params, "5rqHkmhJJfAxWBFNo")
  //     .then(
  //       (repsonse) => {
  //         console.log("success", repsonse.status);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  try {
    const info = await transporter.sendMail({
      from: '"Vitality" tanveeiii15@gmail.com',
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
app.post("/forgotPassword", async (req, res) => {
  const email = req.body["email"];
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);
    if(!user){
      res.json({message:"No user found with this email"})
    }
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: user.id,
      },
    });
    console.log(tokengen);
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const subject = "Reset Your Password";
    const message = `Click the following link to reset your password. This link is valid for 15 minutes:\n\n${resetLink}`;
    sendEmail(user.email, subject, message);
    res.json({
      message:
        "Password reset token generated. Check your email for instructions.",
    });
  } catch (e) {
    res.json(e);
  }
});

app.post("/resetPassword", async (req, res) => {
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
    await prisma.user.update({
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

app.post("/forgotDoctorPassword", async (req, res) => {
  const email = req.body["email"];
  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        email: email,
      },
    });
    console.log(doctor);
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: doctor.id,
      },
    });
    console.log(tokengen);
    const resetLink = `http://localhost:5173/doctor/reset_password?token=${token}`;
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

app.post("/resetDoctorPassword", async (req, res) => {
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

app.post("/forgotAdminPassword", async (req, res) => {
  const email = req.body["email"];
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    console.log(admin);
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const tokengen = await prisma.passwordResetToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: admin.id,
      },
    });
    console.log(tokengen);
    const resetLink = `http://localhost:5173/admin/reset_password?token=${token}`;
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

app.post("/resetAdminPassword", async (req, res) => {
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

server.listen(3001, () => console.log("Server running on port 3001"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.post('/node-chat', async (req, res) => {
  try {
    const { user_id, message } = req.body;

    const response = await axios.post('http://localhost:5000/chatWithBot', {
      user_id,
      message
    }); 

    res.json(response.data);
  } catch (error) {
    console.error('Error calling Flask API:', error.message);
    res.status(500).json({ error: error.message });
  }
});