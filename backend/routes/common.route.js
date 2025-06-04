import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";

const commonRouter = Router();

commonRouter.get(
  "/getPastEvents",
  authorizeRoles("user", "doc", "admin"),
  async (req, res) => {
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
  }
);

commonRouter.get(
  "/events",
  authorizeRoles("user", "doc", "admin"),
  async (req, res) => {
    try {
      const events = await prisma.events.findMany({
        where: {
          dateTime: {
            gte: new Date(),
          },
        },
      });
      res.json(events);
    } catch (e) {
      console.error(e);
      res.status(0).json({ message: "Error fetching events" });
    }
  }
);

commonRouter.post(
  "/save-subscription",
  authorizeRoles("user", "doc", "admin"),
  async (req, res) => {
    try {
      // console.log("HELLLLLOOOOOOO");
      const { userid, subscription, userType } = req.body;
      // console.log(userid);
      // console.log(subscription);
      if (!userid || !subscription) {
        return res
          .status(400)
          .json({ error: "Missing userId or subscription" });
      }

      // console.log(userType, " userType");

      // const { endpoint, keys } = subscription;
      // console.log("hi");
      if (userType == "user") {
        // const existingSub = await prisma.subscription.findMany({
        //   where: { userId: Number(userid)
        //    },
        // });
        // console.log("ECISTIING subscription");
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
          const subs = await prisma.subscription.upsert({
            where: {
              // OR: [
              //   {
              // userId: Number(userid),
              endpoint: subscription,
              //   }
              // ]
            },
            update: {
              userId: Number(userid),
              endpoint: subscription,
              // authKey: keys.auth,
              // p256dhKey: keys.p256dh,
            },
            create: {
              userId: Number(userid),
              endpoint: subscription,
              // authKey: keys.auth,
              // p256dhKey: keys.p256dh,
            },
          });
          // console.log(subs);
          // }
        } catch (e) {
          console.error(e);
          res.json(e);
        }
      } else if (userType == "doc") {
        try {
          const subs = await prisma.subscription.upsert({
            where: {
              // OR: [
              //   {
              // userId: Number(userid),
              endpoint: subscription,
              //   }
              // ]
            },
            update: {
              doctorId: Number(userid),
              endpoint: subscription,
              // authKey: keys.auth,
              // p256dhKey: keys.p256dh,
            },
            create: {
              doctorId: Number(userid),
              endpoint: subscription,
              // authKey: keys.auth,
              // p256dhKey: keys.p256dh,
            },
          });
          // console.log(subs);
          res.json({ success: true });
        } catch (e) {
          console.error(e);
          res.json(e);
        }
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      res.status(500).json({ error: "Error saving subscription" });
    }
  }
);

commonRouter.post(
  "/send-notification",
  authorizeRoles("user", "admin", "doc"),
  async (req, res) => {
    try {
      const { userid, message, userType } = req.body;
      if (!userid || !message) {
        return res.status(400).json({ error: "Missing userId or message" });
      }
      // console.log("heyyyy");
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

      // const payload = JSON.stringify({
      //   title: "New Message",
      //   body: message,
      // });
      for (const sub of subscription) {
        try {
          // await webpush.sendNotification(
          //   {
          //     endpoint: sub.endpoint,
          //     keys: {
          //       auth: sub.authKey,
          //       p256dh: sub.p256dhKey,
          //     },
          //   },
          //   payload
          // );
          const payload = {
            token: sub.endpoint,
            notification: {
              title: "Vitality",
              body: message,
            },
          };
          const response = await admin.messaging().send(payload);
        } catch (err) {
          console.error("Failed to send to one subscription:", err);
        }
      }
      res.send({ success: true });

      // res.json({ success: true });
    } catch (error) {
      console.error("Push error:", error);
      res.status(500).json({ error: "Failed to send push notification" });
    }
  }
);

commonRouter.get(
  "/available-slots",
  authorizeRoles("user", "doc", "admin"),
  async (req, res) => {
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
  }
);

commonRouter.get(
  "/getDoc",
  authorizeRoles("user", "doc", "admin"),
  async (req, res) => {
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
  }
);

export default commonRouter;
