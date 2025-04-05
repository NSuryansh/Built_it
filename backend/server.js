import express from "express";
import bcrypt, { compareSync } from "bcryptjs";
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
import webpush from "web-push";

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

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

webpush.setVapidDetails(
  "mailto:spython.webd@gmail.com",
  publicVapidKey,
  privateVapidKey
);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://built-it.vercel.app"], // Change this to your frontend URL in production
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://built-it-xjiq.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
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
  // console.log(`User connected: ${socket.id}`);
  socket.on("register", ({ userId }) => {
    users.set(userId, socket.id);
    // console.log(userId);
  });
  socket.on("joinRoom", ({ userId, doctorId }) => {
    const room = `chat_${[userId, doctorId].sort((a, b) => a - b).join("_")}`;
    socket.join(room);
    // console.log(`Socket id ${socket.id} joined room ${room}`);
  });
  socket.on(
    "sendMessage",
    async ({
      userId,
      doctorId,
      sender,
      encryptedText,
      iv,
      encryptedAESKey,
      authTag,
    }) => {
      try {
        var senderId, recipientId;
        if (sender == "Doctor") {
          senderId = doctorId;
          recipientId = userId;
        } else {
          senderId = userId;
          recipientId = doctorId;
        }
        const message = await prisma.message.create({
          data: {
            senderId: parseInt(senderId),
            recipientId: parseInt(recipientId),
            encryptedText: encryptedText,
            iv: iv,
            encryptedAESKey,
            authTag,
            senderType: sender,
          },
        });
        const room = `chat_${[userId, doctorId]
          .sort((a, b) => a - b)
          .join("_")}`;
        // console.log(senderId, "message sent to", recipientId);

        // console.log(users.get(recipientId));
        io.to(room).emit("receiveMessage", {
          id: message.id,
          senderId,
          encryptedText,
          iv,
          encryptedAESKey,
          authTag,
          senderType,
        });
        // console.log("Message sent");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  );
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
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
  const department = req.body["department"];
  const acadProg = req.body["acadProg"];
  const rollNo = Number(req.body["rollNo"]);
  const gender = req.body["gender"];

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
        rollNo: rollNo,
        acadProg: acadProg,
        department: department,
        gender: gender,
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
    const { id, username, email, mobile, alt_mobile, gender } = req.body;

    // console.log(req.body);

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      // console.log(existingUsername);
      if (existingUsername && existingUsername.id !== Number(id)) {
        return res.status(400).json({ error: "Username is already in use" });
      }
    }

    const validGenders = ["MALE", "FEMALE", "OTHER"];
    if (gender && !validGenders.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender value" });
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
      ...(gender && { gender }),
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
  // console.log(req.body);
  const username = req.body["username"];
  const password = req.body["password"];

  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    return res.status(401).json({ message: "User doesn't exist" });
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
    // console.log(token);
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });
    // console.log(user);
    res.json(JSON.parse(JSON.stringify({ user: user, message: "User found" })));
  } catch (e) {
    // console.log(e);
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
    // console.log(req.query["userId"]);
    // console.log(userId);
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
    const { userId, recId, userType, recType } = req.query;
    // console.log(userId);
    // console.log(recId);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(userId),
            recipientId: parseInt(recId),
            senderType: userType,
          },
          {
            senderId: parseInt(recId),
            recipientId: parseInt(userId),
            senderType: recType,
          },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    // console.log(messages);
    res.json(messages);
  } catch (e) {
    console.log(e);
  }
});

app.post("/reschedule", async (req, res) => {
  const id = req.body["appId"];
  // console.log(id);
  try {
    const reschedule = await prisma.requests.delete({ where: { id: id } });
    res.json(reschedule);
  } catch (e) {
    res.json(e);
  }
});

// app.get("/getPastApp", async (req, res) => {
//   const { docId } = req.query;
//   try {
//     const app = await prisma.pastAppointments.findMany({
//       where: {
//         doc_id: Number(docId),
//       },
//     });
//     res.json(app);
//   } catch (e) {
//     res.json(e);
//   }
// });

app.get("/getPastEvents", async (req, res) => {
  try {
    // console.log("hello");
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
    // console.log(events);
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

app.post("/addSlot", async (req, res) => {
  const doc_id = Number(req.body["doc_id"]);
  const slotTime = req.body["time"];
  const slot = await prisma.slots.create({
    data: {
      doctor_id: doc_id,
      starting_time: Date(slotTime),
    },
  });
  res.json(slot);
});

app.post("/addLeave", async (req, res) => {
  const doc_id = Number(req.body["doc_id"]);
  const startTime = Date(req.body["startTime"]);
  const endTime = Date(req.body["endTime"]);
  const leave = await prisma.doctorLeave.create({
    data: {
      doctor_id: doc_id,
      date_start: startTime,
      date_end: endTime,
    },
  });

  res.json(leave);
});

app.post("/addDoc", async (req, res) => {
  const {
    name,
    mobile,
    email,
    password,
    reg_id,
    desc,
    address,
    city,
    experenice,
    img,
  } = req.body;
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
        address: address,
        city: city,
        experience: experenice,
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
  const date = new Date();
  const newDate = new Date(dateTime);
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const some = new Date(newDate.getTime() - userTimezoneOffset);
  const reason = req.body["reason"];
  const appId = req.body["id"];
  // console.log(req.body);
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

    const result = await prisma.$transaction(async (prisma) => {
      // Create appointment
      const appointment = await prisma.appointments.create({
        data: {
          user_id: userId,
          doctor_id: doctorId,
          dateTime: some,
          reason: reason,
        },
      });

      //Remove from requests table
      const reqDel = await prisma.requests.delete({
        where: { id: parseInt(appId) },
      });
      // console.log(reqDel);
      return { appointment, reqDel };
    });
    res.json({ message: "Appointment booked successfully", result });
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

    const date = new Date(dateTime);
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
    { userId: doctor.id, username: doctor.name, email: doctor.email },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login successful", token });
});

app.post("/adminLogin", async (req, res) => {
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
  // console.log(appt);
  res.json(appt);
});

app.get("/docProfile", async (req, res) => {
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
    console.log(e);
  }
});

app.get("/adminProfile", async (req, res) => {
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

app.post("/addEvent", async (req, res) => {
  try {
    const title = req.body["title"];
    const description = req.body["description"];
    const dateTime = req.body["dateTime"];
    const venue = req.body["venue"];
    const url = req.body["url"];

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
        url: url,
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

app.get("/pastuserappt", async (req, res) => {
  const userId = Number(req.query["userId"]);
  // console.log(userId);
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
      include: {
        doc: true,
      },
    }); // Fetch all appts
    // console.log(appt);
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
      include: {
        doctor: true,
      },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching current appointments" });
  }
});

app.get("/pastApp", async (req, res) => {
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
    console.log(e);
    res.json(e);
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
    // console.log("Email sent:", info.messageId);
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
    // console.log(user);
    if (!user) {
      res.json({ message: "No user found with this email" });
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
    // console.log(tokengen);
    const resetLink = `https://built-it-1.onrender.com//reset-password?token=${token}`;
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
    const resetLink = `https://built-it-1.onrender.com//doctor/reset_password?token=${token}`;
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
    // console.log(admin);
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
    const resetLink = `https://built-it-1.onrender.com/admin/reset_password?token=${token}`;
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

app.post("/save-subscription", async (req, res) => {
  try {
    console.log("HELLLLLOOOOOOO")
    const { userid, subscription, userType } = req.body;
    // console.log(userid);
    // console.log(subscription);
    if (!userid || !subscription) {
      return res.status(400).json({ error: "Missing userId or subscription" });
    }

    // console.log(userType, " userType");

    const { endpoint, keys } = subscription;
    if (userType == "user") {
      // const existingSub = await prisma.subscription.findMany({
      //   where: { userId: Number(userid)
      //    },
      // });
      console.log("ECISTIING subscription")
      try {
        // if (existingSub) {
        //   await prisma.subscription.updateMany({
        //     where: { userId: Number(userid)} ,
        //     data: {
        //       endpoint: endpoint,
        //       authKey: keys.auth,
        //       p256dhKey: keys.p256dh,
        //     },
        //   });
        // } else {
          // Create a new subscription
          await prisma.subscription.create({
            data: {
              userId: Number(userid),
              endpoint: endpoint,
              authKey: keys.auth,
              p256dhKey: keys.p256dh,
            },
          });
        // }
      } catch (e) {
        console.log(e);
        res.json(e);
      }
    } else if (userType == "doc") {
      try {
        await prisma.subscription.upsert({
          where: {
            doctorId: Number(userid),
          },
          update: {
            endpoint: endpoint,
            authKey: keys.auth,
            p256dhKey: keys.p256dh,
          },
          create: {
            data: {
              doctorId: userid,
              endpoint: endpoint,
              authKey: keys.auth,
              p256dhKey: keys.p256dh,
            },
          },
        });
        res.json({ success: true });
      } catch (e) {
        console.log(e);
        res.json(e);
      }
    }
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Error saving subscription" });
  }
});

app.post("/send-notification", async (req, res) => {
  try {
    const { userid, message, userType } = req.body;
    if (!userid || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    // Fetch the subscription from the database
    var subscription;
    if (userType == "user") {
      subscription = await prisma.subscription.findMany({
        where: { userId: userid },
      });
    } else if (userType == "doc") {
      subscription = await prisma.subscription.findMany({
        where: {
          doctorId: userid,
        },
      });
    }

    // console.log(subscription);

    if (!subscription) {
      return res.status(404).json({ error: "User subscription not found" });
    }

    const payload = JSON.stringify({
      title: "New Message",
      body: message,
    });
    for (const sub of subscription) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.authKey,
              p256dh: sub.p256dhKey,
            },
          },
          payload
        );
      } catch (err) {
        console.error("Failed to send to one subscription:", err);
        // Optionally remove from DB if err.statusCode === 410 (expired)
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Push error:", error);
    res.status(500).json({ error: "Failed to send push notification" });
  }
});

app.post("/node-chat", async (req, res) => {
  try {
    // console.log("HELOE");
    const { user_id, message } = req.body;

    const response = await axios.post("http://127.0.0.1:5000/chatWithBot", {
      user_id,
      message,
    });
    // console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/available-slots", async (req, res) => {
  const { docId, date } = req.query;
  const doctor_id = Number(docId);

  if (!date) {
    return res.status(400).json({ error: "Please provide a valid date." });
  }

  const selectedDate = new Date(date + "T00:00:00Z");

  try {
    const bookedSlots = await prisma.appointments.findMany({
      where: {
        doctor_id,
        dateTime: {
          gte: new Date(selectedDate.setUTCHours(0, 0, 0, 0)),
          lt: new Date(selectedDate.setUTCHours(23, 59, 59, 999)),
        },
      },
      select: { dateTime: true },
    });
    const doctorLeaves = await prisma.doctorLeave.findMany({
      where: {
        doctor_id: doctor_id,
        OR: [
          {
            date_start: {
              lte: new Date(selectedDate.setUTCHours(23, 59, 59, 999)),
            },
            date_end: { gte: new Date(selectedDate.setUTCHours(0, 0, 0, 0)) },
          },
        ],
      },
      select: { date_start: true, date_end: true },
    });

    let availableSlots = await prisma.slots.findMany({
      where: { doctor_id: doctor_id },
    });

    const bookedTimes = bookedSlots.map((b) => {
      const dateObj = new Date(b.dateTime);
      return dateObj.getUTCHours() * 60 + dateObj.getUTCMinutes();
    });

    // console.log(bookedSlots);

    const leavePeriods = doctorLeaves.map((leave) => ({
      start: new Date(leave.date_start).getTime(),
      end: new Date(leave.date_end).getTime(),
    }));

    availableSlots = availableSlots.filter((slot) => {
      const slotTime = new Date(slot.starting_time);
      const slotMinutes =
        slotTime.getUTCHours() * 60 + slotTime.getUTCMinutes();

      return !bookedTimes.includes(slotMinutes);
    });

    availableSlots = availableSlots.filter((slot) => {
      const slotDateTime = new Date(selectedDate);
      const slotTime = new Date(slot.starting_time);

      slotDateTime.setUTCHours(
        slotTime.getUTCHours(),
        slotTime.getUTCMinutes(),
        0,
        0
      );
      const slotTimestamp = slotDateTime.getTime();

      return !leavePeriods.some(
        (leave) => slotTimestamp >= leave.start && slotTimestamp <= leave.end
      );
    });
    // console.log(availableSlots);
    res.json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Couldn't fetch the slots" });
  }
});

app.get("/getDoc", async (req, res) => {
  const { docId } = req.query;
  const doctor_id = Number(docId);

  try {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctor_id,
      },
    });
    const certifications = await prisma.docCertification.findMany({
      where: {
        doctor_id: doctor_id,
      },
    });
    const education = await prisma.docEducation.findMany({
      where: {
        doctor_id: doctor_id,
      },
    });
    res.json({
      doctor: doctor,
      certifications: certifications,
      education: education,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Couldn't fetch data" });
  }
});

app.get("/check-user", async (req, res) => {
  const { username } = req.query;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    res.json({ message: "Username already exists!" });
  } else {
    res.json({ message: "No such username" });
  }
});

app.post("/otpGenerate", async (req, res) => {
  const email = req.body["email"];
  // console.log(email);
  try {
    const otp = Math.trunc(100000 + Math.random() * 900000);
    // console.log(otp);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    // console.log(expiresAt);

    const otpgen = await prisma.otpVerification.create({
      data: {
        token: otp,
        expiresAt: expiresAt,
        useremail: email,
      },
    });

    // console.log(otpgen);
    const subject = "OTP Verification";
    const message = `Use the following OTP to verify signup for Vitality: ${otp}`;
    sendEmail(email, subject, message);
    res.json({
      message: "OTP sent to your mail!",
    });
  } catch (e) {
    res.json(e);
  }
});

app.post("/otpcheck", async (req, res) => {
  const otp = req.body["otp"];
  const email = req.body["email"];
  // console.log(otp, "OTP");

  try {
    const otpRecord = await prisma.otpVerification.findFirstOrThrow({
      where: {
        token: Number(otp),
        useremail: email,
      },
      orderBy: {
        expiresAt: "desc",
      },
    });
    // console.log(otpRecord);
    // console.log(email, "JKSFJK");

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    await prisma.otpVerification.delete({
      where: { id: otpRecord.id },
    });
    res.json({ message: "Email verified" });
  } catch (e) {
    res.status(500).json({
      error: "An error occurred during OTP verification",
      details: e.message,
    });
  }
});

app.post("/scores-bot", async (req, res) => {
  try {
    const { user_id } = req.body;

    const response = await axios.post("http://127.0.0.1:5000/analyze", {
      user_id,
    });

    // console.log(response.data.json);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling the Flas API: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put("/modifyDoc", async (req, res) => {
  try {
    const { id, address, city, experience } = req.query;
    const doc_id = Number(id);
    console.log(req.query);

    const doctorId = parseInt(doc_id, 10);
    if (isNaN(doctorId) || doctorId <= 0) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }

    const orConditions = [];
    if (address) orConditions.push({ address });
    if (city) orConditions.push({ city });
    if (experience) orConditions.push({ experience });

    const existingDoctor = orConditions.length
      ? await prisma.doctor.findFirst({
          where: { OR: orConditions },
        })
      : null;

    if (existingDoctor && existingDoctor.id !== doctorId) {
      return res
        .status(400)
        .json({ error: "The updated field is already in use" });
    }

    const updatedData = {};
    if (address?.trim()) updatedData.address = address;
    if (city?.trim()) updatedData.city = city;
    if (experience?.trim()) updatedData.experience = experience;

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
});

app.post("/emerApp", async (req, res) => {
  const { name, email, phone, dateTime, reason, docId } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    const app = await prisma.appointments.create({
      data: {
        user_id: user.id,
        doctor_id: Number(docId),
        dateTime: new Date(dateTime),
        reason: reason,
      },
    });
    res.json(app);
  } else {
    const app = await prisma.emergencyApp.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        dateTime: new Date(dateTime),
        reason: reason,
        doctor_id: Number(docId),
      },
    });
    // console.log(app);
    res.json(app);
  }
});

app.get("/all-appointments", async (req, res) => {
  try {
    // Fetch upcoming/current appointments with related doctor and user
    const appts = await prisma.appointments.findMany({
      include: {
        doctor: {
          select: {
            name: true,
            desc: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
            rollNo: true,
            department: true,
            acadProg: true,
            gender: true,
          },
        },
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
});

app.post("/add-slot", async (req, res) => {
  const doctorId = req.body["doctorId"];
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

app.post("/referrals", async (req, res) => {
  const { user_id, doctor_id, referred_by, reason } = req.body;

  if (!user_id || !doctor_id || !referred_by || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newReferral = await prisma.referrals.create({
      data: {
        user_id,
        doctor_id,
        referred_by,
        reason,
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

app.get("/get-referrals", async (req, res) => {
  const { doctor_id } = req.body;
  try {
    const data = await prisma.referrals.findMany({
      where: { doctor_id: doctor_id },
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

app.post("/request-to-user", async (req, res) => {
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

    res.json({
      message: "Appointment requested successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

app.post("/accept-booking-by-user", async (req, res) => {
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
  const dateTime = req.body["dateTime"];
  const date = new Date();
  const newDate = new Date(dateTime);
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const some = new Date(newDate.getTime() - userTimezoneOffset);
  const reason = req.body["reason"];
  const appId = req.body["id"];
  // console.log(req.body);
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

    const result = await prisma.$transaction(async (prisma) => {
      // Create appointment
      const appointment = await prisma.appointments.create({
        data: {
          user_id: userId,
          doctor_id: doctorId,
          dateTime: some,
          reason: reason,
          isDoctor: true,
        },
      });

      //Remove from requests table
      const reqDel = await prisma.requests.delete({
        where: { id: parseInt(appId) },
      });
      // console.log(reqDel);
      return { appointment, reqDel };
    });
    res.json({
      message: "Appointment accepted and booked with student successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

app.post("/rating", async (req, res) => {
  const stars = req.body["stars"];
  const appId = req.body["id"];
  try {
    const updatedApp = await prisma.appointments.update({
      where: { id: appId },
      data: {
        stars: stars,
      },
    });
    res.json({
      message: "Stars Added",
      updatedApp,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error adding stars" });
  }
});

server.listen(3000, () => console.log("Server running on port 3000"));
