import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import webpush from "web-push";
import admin from "firebase-admin";
import userRouter from "./routes/user.route.js";
import docRouter from "./routes/doctor.route.js";
import adminRouter from "./routes/admin.route.js";
import userDocRouter from "./routes/user_doctor.route.js";
import userAdminRouter from "./routes/user_admin.route.js";
import docAdminRouter from "./routes/doctor_admin.route.js";
import commonRouter from "./routes/common.route.js";
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

export const prisma = new PrismaClient();
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = createServer(app);
const port = 3000;
dotenv.config();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const serviceAccount = JSON.parse(process.env.FIREBASE_ACCOUNT_SERVICE_KEY);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

webpush.setVapidDetails(
  "mailto:spython.webd@gmail.com",
  publicVapidKey,
  privateVapidKey,
);

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/doc", docRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user_doc", userDocRouter);
app.use("/api/user_admin", userAdminRouter);
app.use("/api/doc_admin", docAdminRouter);
app.use("/api/common", commonRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const users = new Map();
io.on("connection", (socket) => {
  socket.on("register", ({ userId }) => {
    users.set(userId, socket.id);
  });
  socket.on("joinRoom", ({ userId, doctorId }) => {
    const room = `chat_${[Number(userId), Number(doctorId)]
      .sort((a, b) => a - b)
      .join("_")}`;
    socket.join(room);
  });
  socket.on("countUnseen", async ({ userId, senderType }) => {
    var unreadCount;
    if (senderType === "user") {
      unreadCount = await prisma.message.groupBy({
        by: ["doctorId"],
        where: {
          userId: Number(userId),
          senderType: "doc",
          read: false,
        },
        _count: {
          _all: true,
        },
      });
      // res.json(unreadCount)
    } else if (senderType === "doc") {
      unreadCount = await prisma.message.groupBy({
        by: ["userId"],
        where: {
          doctorId: Number(userId),
          read: false,
          senderType: "user",
        },
        _count: {
          _all: true,
        },
      });
      // res.json(unreadCount)
    }

    socket.emit("unreadCount", unreadCount);
  });
  socket.on("markAsRead", async ({ userId, doctorId, senderType }) => {
    try {
      if (senderType === "user") {
        const result = await prisma.message.updateMany({
          where: {
            senderType: "doc",
            userId: Number(userId),
            doctorId: Number(doctorId),
          },
          data: {
            read: true,
          },
        });
      } else if (senderType === "doc") {
        const result = await prisma.message.updateMany({
          where: {
            senderType: "user",
            userId: Number(userId),
            doctorId: Number(doctorId),
          },
          data: {
            read: true,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
  socket.on(
    "sendMessage",
    async ({
      userId,
      doctorId,
      senderType,
      encryptedText,
      iv,
      encryptedAESKey,
      authTag,
    }) => {
      try {
        const message = await prisma.message.create({
          data: {
            userId: parseInt(userId),
            doctorId: parseInt(doctorId),
            encryptedText: encryptedText,
            iv,
            encryptedAESKey,
            authTag,
            senderType: senderType,
          },
        });
        const room = `chat_${[Number(userId), Number(doctorId)]
          .sort((a, b) => a - b)
          .join("_")}`;

        var senderId;
        if (senderType === "doc") {
          senderId = doctorId;
        } else {
          senderId = userId;
        }
        socket.to(room).emit("receiveMessage", {
          id: message.id,
          senderId,
          encryptedText,
          iv,
          encryptedAESKey,
          senderType,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
  );

  socket.on("leaveRoom", async ({ userId, doctorId }) => {
    const room = `chat_${[Number(userId), Number(doctorId)]
      .sort((a, b) => a - b)
      .join("_")}`;
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
  });
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
    console.error(e);
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

// app.post("/feelings", authorizeRoles("") ,async (req, res) => {
//   try {
//     const { userId, menPeace, sleepQ, socLife, passion, lsScore, happyScore } =
//       req.body;

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     const feelings = await prisma.feelings.upsert({
//       where: { user_id: userId },
//       update: {
//         mental_peace: menPeace,
//         sleep_quality: sleepQ,
//         social_life: socLife,
//         passion: passion,
//         less_stress_score: lsScore,
//         happiness_score: happyScore,
//       },
//       create: {
//         user_id: userId,
//         mental_peace: menPeace,
//         sleep_quality: sleepQ,
//         social_life: socLife,
//         passion: passion,
//         less_stress_score: lsScore,
//         happiness_score: happyScore,
//       },
//     });

//     res.status(200).json(feelings);
//   } catch (error) {
//     console.error("Error adding/updating feelings:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/node-chat", async (req, res) => {
//   try {
//     const { user_id, message } = req.body;

//     const response = await axios.post(
//       "https://built-it-python-895c.onrender.com/chatWithBot",
//       {
//         user_id,
//         message,
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error calling Flask API:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/scores-bot", async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     const response = await axios.post(
//       "https://built-it-python-895c.onrender.com/analyze",
//       {
//         user_id,
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error calling the Flas API: ", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.post("/rating", async (req, res) => {
//   const stars = req.body["stars"];
//   const appId = req.body["id"];
//   try {
//     const updatedApp = await prisma.appointments.update({
//       where: { id: appId },
//       data: {
//         stars: stars,
//       },
//     });
//     res.json({
//       message: "Stars Added",
//       updatedApp,
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({ message: "Error adding stars" });
//   }
// });

app.post("/sso", async (req, res) => {
  const { token } = req.query;
  try {
    const response = await fetch("https://hms.iiti.ac.in/api/sso/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
      }),
    });
    const data = await response.json();
    if (data.success === true || data.success === "true") {
      const email = data.user.email;
      const user = await prisma.user.findUnique({ where: { email: email } });
      if (user) {
        return res
          .status(200)
          .json({ success: true, role: "user", username: user.username });
      }
      const doc = await prisma.doctor.findUnique({ where: { email: email } });
      if (doc) {
        return res.status(200).json({ success: true, role: "doc" });
      }
      const admin = await prisma.admin.findUnique({ where: { email: email } });
      if (admin) {
        return res.status(200).json({ success: true, role: "admin" });
      }
      return res.status(200).json({ success: true, role: "none" });
    }
    res.status(400).json({ success: false, message: "User not logged in" });
  } catch (error) {}
});
// Base URL of your Flask service
const PYTHON_BASE = process.env.PYTHON_BASE || "http://127.0.0.1:5000";

// 1) POST /chat → forwards to Flask /chatWithBot
app.post("/api/chat", async (req, res) => {
  try {
    const { data } = await axios.post(`${PYTHON_BASE}/chatWithBot`, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(data);
  } catch (err) {
    console.error("Error calling Flask /chatWithBot:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2) POST /scores → forwards to Flask /analyze
app.post("/api/scores", async (req, res) => {
  try {
    const { data } = await axios.post(`${PYTHON_BASE}/analyze`, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    res.json(data);
  } catch (err) {
    if (err.response.data.error == "User not found") {
      res.status(200).json({ error: err.response.data.error });
    } else {
      console.error("Error calling Flask /analyze:", err.response.data);
      res.status(500).json({ error: err.response.data.error });
    }
  }
});

// 3) POST /emotion → forwards multipart‐form audio upload to Flask /emotion
import multer from "multer";
const upload = multer();
app.post("/emotion", upload.single("audio"), async (req, res) => {
  try {
    // build form-data for Python
    const form = new FormData();
    form.append("audio", req.file.buffer, { filename: "audio.wav" });
    const { data } = await axios.post(`${PYTHON_BASE}/emotion`, form, {
      headers: form.getHeaders(),
    });
    res.json(data);
  } catch (err) {
    console.error("Error calling Flask /emotion:", err.message);
    res.status(500).json({ error: err.message });
  }
});

server.listen(port, () => console.log("Server running on port 3000"));
