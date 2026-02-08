import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";
import { sendEmail } from "../utils/sendEmail.js";

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

userDocRouter.post("/book", authorizeRoles("doc", "user"), async (req, res) => {
  const forDoctor = req.body["forDoctor"]|| true
  const userId = req.body["userId"];
  const doctorId = req.body["doctorId"];
  // if (doctorId !== req.user.userId) {
  //   console.log(userId)
  //   console.log("H", doctorId)
  //   console.log(req.user.id)
  //   console.log("HELLO")
  //   return res.status(403).json({ error: "Access denied" });
  // }
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
          isDoctor: forDoctor,
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
      } has been scheduled. The details of the appointment are given below: \n\nDate: ${new Date(
        some
      ).toDateString()}\nTime: ${new Date(some).toTimeString()}\nVenue: ${
        doctor.office_address
      }\n\nRegards\nCalm Connect`
    );

    await sendEmail(
      doctor.email,
      "Appointment Scheduled",
      `Dear ${doctor.name}, \n\nYour appointment with ${
        user.username
      } has been scheduled. The details of the appointment are given below: \n\nDate: ${new Date(
        some
      ).toDateString()}\nTime: ${new Date(some).toTimeString()}\nVenue: ${
        doctor.office_address
      }\n\nRegards\nCalm Connect`
    );

    res.json({ message: "Appointment booked successfully", result });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal Server Error" });
  }
});

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

      await sendEmail(
        doctor.email,
        "Appointment Requested",
        `Dear ${doctor.name}, \n\nAn appointment has been requested by ${
          user.username
        }. The details of the request are given below: \n\nDate: ${new Date(
          date
        ).toDateString()}\nTime: ${new Date(
          date
        ).toTimeString()}\nReason: ${reason}\n\nRegards\nCalm Connect`
      );

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

userDocRouter.post("/cancelRequest", authorizeRoles("user", "doc"), async (req, res) => {
    try {
      const requestId = Number(req.body.id);
      const reason = req.body.reason;

      if (!requestId || !reason) {
        return res.status(400).json({ message: "Both request id and reason are required" });
      }

      const cancelled = await prisma.$transaction(async (tx) => {
        const request = await tx.requests.findUnique({
          where: { id: requestId },
        });
        if (!request) {
          throw new Error("Request not found");
        }
        const cancelledRequest = await tx.cancelledRequest.create({
          data: {
            user_id: request.user_id,
            doctor_id: request.doctor_id,
            reason,
            forDoctor: request.forDoctor,
            appointmentTime: request.dateTime,
            dateTime: new Date(),             
          },
        });
        await tx.requests.delete({
          where: { id: requestId },
        });
        return cancelledRequest;
      });
      return res.status(200).json({
        message: "Request cancelled successfully",
        cancelled,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message || "Failed to cancel request",
      });
    }
  }
);

export default userDocRouter;
