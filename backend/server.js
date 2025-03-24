import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import cors from "cors"
import { Server } from "socket.io"
import { createServer } from "http"
import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

const prisma = new PrismaClient()
const app = express()
app.use(express.json());
const server = createServer(app)
const port = 3000
dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

app.use(cors())
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
})

cloudinary.config({
    cloud_name: 'dt7a9meug',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadImage(path) {
    const results = await cloudinary.uploader.upload(path)
    return results["url"]
}

const users = new Map()
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)
    socket.on("register", ({ userId }) => {
        users.set(userId, socket.id)
        console.log(userId)
    })
    socket.on("sendMessage", async ({ senderId, recipientId, encryptedText, iv, encryptedAESKey, authTag }) => {
        try {
            const message = await prisma.message.create({
                data: { senderId: parseInt(senderId), recipientId: parseInt(recipientId), encryptedText: encryptedText, iv: iv, encryptedAESKey, authTag },
            });
            console.log(senderId, "message sent to", recipientId);
            if (users.has(recipientId)) {
                console.log(users.get(recipientId))
                io.to(users.get(recipientId)).emit("receiveMessage", {
                    senderId, encryptedText, iv, encryptedAESKey, authTag
                });
                console.log("Message sent")
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    })
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                break;
            }
        }
    })
})



app.post('/signup', async (req, res) => {
    const username = req.body['username']
    const email = req.body['email']
    const mobile = req.body['mobile']
    const password = req.body['password']
    const altNo = req.body['altNo']
    const pubKey = req.body["publicKey"]

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                mobile: mobile,
                email: email,
                password: hashedPassword,
                alt_mobile: altNo,
                publicKey: pubKey
            }
        })
        res.status(201).json({ message: "User added" })
    } catch (e) {
        console.log(e)
    }
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    const username = req.body["username"]
    const password = req.body["password"]

    const user = await prisma.user.findUnique({ where: { username: username } })
    if (!user) {
        return res.status(401).json({ message: "User doesn't exists" })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(401).json({ message: "Incorrect password" })
    }
    const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
    });

    res.json({ message: "Login successful", token })
})

app.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        console.log(token)
        return res.status(401).json({ message: "Unauthorized", token })
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        const user = await prisma.user.findUnique({ where: { username: decoded.username } })
        console.log(user)
        res.json(JSON.parse(JSON.stringify({ 'user': user, 'message': 'User found' })))
    } catch (e) {
        console.log(e)
    }
})

app.get('/messages', async (req, res) => {
    try {
        const { userId, recId } = req.query
        console.log(userId)
        console.log(recId)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: parseInt(userId), recipientId: parseInt(recId) },
                    { senderId: parseInt(recId), recipientId: parseInt(userId) }
                ]
            },
            orderBy: { createdAt: "asc" }
        })
        console.log(messages)
        res.json(messages)
    } catch (e) {
        console.log(e)
    }
})

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

app.post('/addDoc', async (req, res) => {
    const { name, mobile, email, password, reg_id, desc, img } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
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
                img: img
            }
        })
        // const resp = await doc.json()
        // console.log(resp)
        res.json({ message: "doc added", doc: doc })
    }catch(e){
        res.json({error:e})
    }
})
app.post("/book", async (req, res) => {
  const { userId, doctorId, dateTime } = req.body;

  try {
    // Check if user exists
    const user = await prisma.User.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if doctor exists
    const doctor = await prisma.Doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create appointment
    const appointment = await prisma.Appointments.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
        dateTime: new Date(dateTime),
      },
    });

    //Remove from requests table
    await prisma.Requests.delete({ where: { id: parseInt(id) } });

    res
      .status(0)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(0).json({ message: "Internal Server Error" });
  }
});

app.post("/requests", async (req, res) => {
  const { userId, doctorId, dateTime } = req.body;

  try {
    // Check if user exists
    const user = await prisma.User.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if doctor exists
    const doctor = await prisma.Doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create appointment
    const appointment = await prisma.Requests.create({
      data: {
        user_id: userId,
        doctor_id: doctorId,
        dateTime: new Date(dateTime),
      },
    });

    res
      .status(0)
      .json({ message: "Appointment request added successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(0).json({ message: "Internal Server Error" });
  }
});

//GET REQUEST FOR DOCTOR LIST
app.get("/getdoctors", async (req, res) => {
  try {
    const events = await prisma.doctor.findMany(); // Fetch all events
    res.json(events); // Send the events as a JSON response
  } catch (e) {
    console.error(e);
    res.status(0).json({ message: "Error fetching doctors" });
  }
});

app.post('/docLogin', async(req,res)=>{
    console.log(req.body)
    const email = req.body["email"]
    const password = req.body["password"]

    const doctor = await prisma.doctor.findUnique({ where: { email: email } })
    if (!doctor) {
        return res.status(401).json({ message: "Email ID is not registered" })
    }
    const match = await bcrypt.compare(password, doctor.password)
    if (!match) {
        return res.status(401).json({ message: "Incorrect password" })
    }
    const token = jwt.sign({ userId: doctor.id, username: doctor.name, email: doctor.email }, SECRET_KEY, {
        expiresIn: "1h",
    });

    res.json({ message: "Login successful", token })
})

app.get('/docProfile', async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        console.log(token)
        return res.status(401).json({ message: "Unauthorized", token })
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        const doctor = await prisma.doctor.findUnique({ where: { email: decoded.email } })
        console.log(doctor)
        res.json(JSON.parse(JSON.stringify({ 'doctor': doctor, 'message': 'Doctor found' })))
    } catch (e) {
        console.log(e)
    }
})



app.post("/book", async (req, res) => {
    const { userId, doctorId, dateTime } = req.body;

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


        const appointment = await prisma.appointments.create({
            data: {
                user_id: userId,
                doctor_id: doctorId,
                dateTime: new Date(dateTime),
            },
        });


        res
            .status(0)
            .json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error(error);
        res.status(0).json({ message: "Internal Server Error" });
    }
});

app.post("/addEvent", async (req, res) => {
    try {
        const { title, description, dateTime, venue } = req.body;

        // Validate required fields
        if (!title || !dateTime || !venue) {
            return res.status(400).json({ error: "Title, DateTime, and Venue are required" });
        }

        // Create the event in Prisma
        const event = await prisma.events.create({
            data: {
                title,
                description,
                dateTime: new Date(dateTime), // Ensure it's a valid Date object
                venue,
            },
        });

        res.status(0).json(event); // Return created event
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(0).json({ error: "Internal server error" });
    }
});

server.listen(3001, () => console.log("Server running on port 3001"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
