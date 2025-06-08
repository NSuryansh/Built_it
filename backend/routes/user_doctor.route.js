import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";

const userDocRouter = Router();

userDocRouter.get(
  "/chatContacts",
  authorizeRoles("doc", "user"),
  async (req, res) => {
    try {
      const userId = req.query["userId"];
      const userType = req.query["userType"];
      // console.log(req.user, "req");
      if (
        userId.toString() !== req.user.userId.toString() ||
        userType.toString() !== req.user.role.toString()
      ) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const id = parseInt(userId);

      const chatPartners = await prisma.message.findMany({
        where: {
          OR: [{ userId: id }, { doctorId: id }],
        },
        select: {
          userId: true,
          doctorId: true,
        },
        distinct: ["userId", "doctorId"],
      });
      // console.log(chatPartners, "chat ")
      const uniqueUserIds = new Set();
      chatPartners.forEach((chat) => {
        if (chat.userId !== id) uniqueUserIds.add(chat.userId);
        if (chat.doctorId !== id) uniqueUserIds.add(chat.doctorId);
      });

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
  }
);

userDocRouter.get(
  "/countUnseen",
  authorizeRoles("user", "doc"),
  async (req, res) => {
    const { userId, senderType } = req.query;
    if (userId !== req.user.userId) {
      res.json({ error: "Access denied" });
    }
    if (senderType == "user") {
      const unreadCount = await prisma.message.groupBy({
        by: ["senderId"],
        where: {
          recipientId: Number(userId),
          senderType: "doc",
          read: false,
        },
        _count: {
          _all: true,
        },
      });
      // console.log(unreadCount, "HALLLO")
      res.json(unreadCount);
    } else if (senderType == "doc") {
      const unreadCount = await prisma.message.groupBy({
        by: ["senderId"],
        where: {
          recipientId: Number(userId),
          read: false,
          senderType: "user",
        },
        _count: {
          _all: true,
        },
      });
      // console.log(unreadCount)
      res.json(unreadCount);
    }
  }
);

userDocRouter.get(
  "/messages",
  authorizeRoles("user", "doc"),
  async (req, res) => {
    try {
      const { userId, recId, userType, recType } = req.query;
      if (userType === "user") {
        if (userId.toString() !== req.user.userId.toString()) {
          return res.status(403).json({ error: "Access denied" });
        }
      } else {
        if (recId.toString() !== req.user.userId.toString()) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
      // console.log(userId, recId, userType, recType);
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              userId: parseInt(userId),
              doctorId: parseInt(recId),
              senderType: userType,
            },
            {
              userId: parseInt(userId),
              doctorId: parseInt(recId),
              senderType: recType,
            },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
      // console.log(messages, "hello");
      res.json(messages);
    } catch (e) {
      console.error(e);
    }
  }
);

userDocRouter.post(
  "/requests",
  authorizeRoles("user", "doc"),
  async (req, res) => {
    const userId = Number(req.body["userId"]);
    const doctorId = Number(req.body["doctorId"]);
    const dateTime = req.body["dateTime"];
    const reason = req.body["reason"];
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
      });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const date = new Date(dateTime);
      const appointment = await prisma.requests.create({
        data: {
          user_id: userId,
          doctor_id: doctorId,
          dateTime: date,
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
  }
);

export default userDocRouter;
