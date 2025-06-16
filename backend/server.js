import express from "express";
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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

webpush.setVapidDetails(
  "mailto:spython.webd@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use("/user", userRouter);
app.use("/doc", docRouter);
app.use("/admin", adminRouter);
app.use("/user_doc", userDocRouter);
app.use("/user_admin", userAdminRouter);
app.use("/doc_admin", docAdminRouter);
app.use("/common", commonRouter);

const io = new Server(server, {
  cors: {
    origin: "https://built-it-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const users = new Map();
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("register", ({ userId }) => {
    users.set(userId, socket.id);
    // console.log(userId);
  });
  socket.on("joinRoom", ({ userId, doctorId }) => {
    const room = `chat_${[Number(userId), Number(doctorId)]
      .sort((a, b) => a - b)
      .join("_")}`;
    // console.log(userId, " ", doctorId);
    socket.join(room);
    // console.log(room);
    // console.log(`Socket id ${socket.id} joined room ${room}`);
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
    // console.log(userId, " ", doctorId, " ", senderType)
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
        // console.log(result,"HHHHHHHHHHHHHHHHHHHHHHHHHh")
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
        // console.log(senderId, ",mesgaerh");
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
    }
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
//     // console.log("HELOE");
//     const { user_id, message } = req.body;

//     const response = await axios.post(
//       "https://built-it-python-895c.onrender.com/chatWithBot",
//       {
//         user_id,
//         message,
//       }
//     );
//     // console.log(response.data);

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

//     // console.log(response.data.json);
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
    const response = await fetch(
      "https://hms-sso-auhnefccahd9fnef.centralindia-01.azurewebsites.net/api/auth/verify-sso-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.success) {
      const email = data.user.email;
      const user = await prisma.user.findUnique({ where: { email: email } });
      if (user) {
        return res
          .status(200)
          .json({ success: true, role: "user", username: user.username });
      }
      const doc = await prisma.doc.findUnique({ where: { email: email } });
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

server.listen(port, () => console.log("Server running on port 3000"));
