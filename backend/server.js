import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { error } from "console";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const server = createServer(app);
const port = 3000;
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    const events = await prisma.events.findMany(); // Fetch all events
    res.json(events); // Send the events as a JSON response
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error fetching events" });
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
  console.log(doctorId);
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
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
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

// app.post("/book", async (req, res) => {
//   const userId = req.body['userId'];
//   const doctorId = req.body['doctorId']
//   const dateTime = req.body['dateTime']
//   console.log(req.body)
//   console.log(doctorId, " hello")

//   try {
//     console.log("HOAS")
//     // Check if user exists
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if doctor exists
//     const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not founfdsfdasd" });
//     }

//     const appointment = await prisma.appointments.create({
//       data: {
//         user_id: userId,
//         doctor_id: doctorId,
//         dateTime: new Date(dateTime),
//       },
//     });

//     res
//       .status(0)
//       .json({ message: "Appointment booked successfully", appointment });
//   } catch (error) {
//     console.error(error);
//     res.status(0).json({ message: "Internal Server Error" });
//   }
// });

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

app.post('/notifications', async(req,res)=>{

})

app.get("/notifications", async (req, res) => {
  try {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);
    const userId = req.body["userId"];

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
  const doctorId = req.query["doctorId"];
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
    const appt = await prisma.appointments.findMany({
      where: { id: doctorId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching current appointments" });
  }
});

app.get("/pastdocappt", async (req, res) => {
  const doctorId = req.body["doctorId"];
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
    const appt = await prisma.PastAppointments.findMany({
      where: { id: doctorId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

app.get("/pastuserappt", async (req, res) => {
  const userId = req.body["userId"];
  // Get today's date range (start and end of today)
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await prisma.User.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const appt = await prisma.PastAppointments.findMany({
      where: { user_id: userId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching past appointments" });
  }
});

app.get("/currentuserappt", async (req, res) => {
  const userId = req.body["userId"];
  // Get today's date range (start and end of today)
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await prisma.User.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const appt = await prisma.Appointments.findMany({
      where: { user_id: userId },
    }); // Fetch all appts
    res.json(appt); // Send the appts as a JSON response
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching current appointments" });
  }
});

app.get("/getfeelings", async (req, res) => {
  const userId = req.body["userId"]; // Fix: Use query parameters

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

server.listen(3001, () => console.log("Server running on port 3001"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
