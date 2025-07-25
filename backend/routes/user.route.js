import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import { prisma } from "../server.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import base64url from "base64url";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";
import { PrismaClient, Prisma } from '@prisma/client';
// const prisma = new PrismaClient();

dotenv.config();

const userRouter = Router();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const base64urlToBuffer = (base64url) => {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=");
  return Buffer.from(base64, "base64");
};

userRouter.post("/signup", async (req, res) => {
  const username = req.body["username"];
  const email = req.body["email"];
  const mobile = req.body["mobile"];
  const password = req.body["password"];
  const altNo = req.body["altNo"];
  const pubKey = req.body["publicKey"];
  const department = req.body["department"];
  const acadProg = req.body["acadProg"];
  const rollNo = req.body["rollNo"];
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
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return res.status(409).json({ error: `${e.meta.target[0]} already exists` });
    }
    console.error(e);
  }
});

const biometricOptions = async (user) => {
  const options = await generateRegistrationOptions({
    rpName: "IITI CalmConnect",
    rpID: "localhost",
    userID: Number(user.id),
    userName: user.email,
    userDisplayName: user.email,
  });
  // console.log(options)
  const addChallenge = await prisma.user.update({
    where: {
      id: Number(user.id),
    },
    data: {
      challenge: base64url.encode(options.challenge),
    },
  });
  return {
    ...options,
    challenge: base64url.encode(options.challenge),
    user: {
      ...options.user,
      id: base64url.encode(options.user.id),
    },
    excludeCredentials: options.excludeCredentials.map((cred) => ({
      ...cred,
      id: base64url.encode(cred.id),
    })),
  };
};

userRouter.post(
  "/generateOptions",
  // authorizeRoles("user"),
  async (req, res) => {
    const user = req.body["user"];
    // console.log('hello')
    // if (user.id !== req.user.id) {
    //   return res.status(403).json({ error: "Access denied" })
    // }
    const options = await biometricOptions(user);
    return res.json({ options: options });
  }
);

userRouter.post(
  "/generateBioAuthOptions",
  // authorizeRoles("user"),
  async (req, res) => {
    const emailId = req.body["emailId"];
    const user = await prisma.user.findUnique({
      where: { email: emailId },
      include: { credentials: true },
    });
    // if (user.id !== req.user.userId) {
    //   return res.status(403).json({ error: "Access denied" })
    // }

    if (!user || user.credentials.length === 0) {
      return res.status(404).json({ error: "No credentials found" });
    }

    const options = await generateAuthenticationOptions({
      allowCredentials: user.credentials.map((cred) => ({
        id: base64url.encode(Buffer.from(cred.credentialID)),
        type: "public-key",
        transports: cred.transports || [],
      })),
      userVerification: "preferred",
    });
    // console.log(options)
    await prisma.user.update({
      where: { id: user.id },
      data: { challenge: options.challenge },
    });

    res.json({ options: options });
  }
);

userRouter.post("/verifyBioLogin",  async (req, res) => {
  const emailId = req.body["emailId"];
  // console.log(emailId, "hiihihih")
  const user = await prisma.user.findUnique({
    where: { email: emailId },
    include: {
      credentials: true,
    },
  });

  if (!user || user.credentials.length === 0) {
    return res.status(404).json({ error: "User or credentials not found" });
  }
  // console.log(req.body)
  // console.log(user.credentials)
  const credential = user.credentials.find(
    (c) => base64url.encode(Buffer.from(c.credentialID)) === req.body.id
  );
  // console.log(credential)
  if (!credential) {
    return res.status(400).json({ error: "Credential not recognized" });
  }
  const encodedCredentialId = base64url.encode(
    Buffer.from(credential.credentialID)
  );
  // console.log(credential.counter)
  const verification = await verifyAuthenticationResponse({
    response: req.body,
    expectedChallenge: user.challenge,
    expectedOrigin: "http://localhost:5174",
    expectedRPID: "localhost",
    credential: {
      credentialID: Buffer.from(credential.credentialID),
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      credentialDeviceType: credential.deviceType,
      credentialBackedUp: credential.backedUp,
    },
  });

  if (!verification.verified) {
    return res
      .status(403)
      .json({ success: false, error: "Verification failed" });
  }
  // console.log(verification)
  await prisma.authenticator.update({
    where: { id: credential.id },
    data: {
      counter: verification.authenticationInfo.newCounter,
    },
  });
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: "user",
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return res.json({ success: true, token });
});

userRouter.put("/modifyUser", async (req, res) => {
  try {
    const { id, username, email, mobile, alt_mobile, gender } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // if (id !== req.user.userId) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
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

    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

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

userRouter.post("/login", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    return res.status(401).json({ message: "User doesn't exist" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: "user",
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login successful", token });
});

userRouter.get("/profile", authorizeRoles("user"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", token });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { username: decoded.username },
    });
    if (user.id !== req.user.userId) {
      res.json({ error: "Access Denied" });
    }
    res.json(JSON.parse(JSON.stringify({ user: user, message: "User found" })));
  } catch (e) {
    console.error(e);
  }
});

userRouter.post(
  "/verifyBioRegistration",
  // authorizeRoles("user"),
  async (req, res) => {
    try {
      const emailId = req.body["emailId"];
      // console.log(emailId)
      const user = await prisma.user.findUnique({
        where: {
          email: emailId,
        },
      });
      const verification = await verifyRegistrationResponse({
        response: req.body,
        expectedChallenge: user.challenge,
        expectedOrigin: "http://localhost:5174",
        expectedRPID: "localhost",
        // authenticator: {
        //     credentialID: credential.credentialID,
        //     credentialPublicKey: credential.publicKey,
        //     counter: credential.counter,
        //     credentialDeviceType: credential.deviceType,
        //     credentialBackedUp: credential.backedUp
        // },
      });
      // console.log(verification)

      if (verification.verified && verification.registrationInfo) {
        await prisma.authenticator.create({
          data: {
            credentialID: base64urlToBuffer(
              verification.registrationInfo.credential.id
            ),
            publicKey: Buffer.from(
              verification.registrationInfo.credential.publicKey
            ),
            counter: verification.registrationInfo.credential.counter,
            deviceType: verification.registrationInfo.credentialDeviceType,
            backedUp: verification.registrationInfo.credentialBackedUp,
            transports: req.body.response?.transports || [],
            user: { connect: { id: user.id } },
          },
        });
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e });
    }
  }
);

userRouter.get("/getRequests", authorizeRoles("user"), async (req, res) => {
  try {
    const userId = Number(req.query["userId"]);
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const reqs = await prisma.requests.findMany({
      where: { user_id: userId, forDoctor: false },
      include: {
        doctor: {
          select: {
            name: true, // assuming "name" is the username
            mobile: true,
            email: true,
          },
        },
      },
    });
    res.json(reqs);
  } catch (error) {
    console.error(error);
  }
});

userRouter.delete(
  "/deleteRequest",
  authorizeRoles("user"),
  async (req, res) => {
    try {
      const id = Number(req.query["id"]);
      const userId = Number(req.query["userId"]);
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      if (userId !== req.user.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const deletedNotif = await prisma.requests.delete({
        where: { id: id },
      });

      res.json({ message: "Notification deleted successfully", deletedNotif });
    } catch (error) {
      console.error("Error deleting notification: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

userRouter.get("/pastuserappt", authorizeRoles("user"), async (req, res) => {
  const userId = Number(req.query["userId"]);
  if (userId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
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

userRouter.get("/currentuserappt", authorizeRoles("user"), async (req, res) => {
  const userId = Number(req.query["userId"]);
  // Get today's date range (start and end of today)
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (req.user.userId.toString() !== userId.toString()) {
    return res.status(403).json({ error: "Access denied" });
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

userRouter.get("/getUserFeelings", authorizeRoles("user"), async (req, res) => {
  const userId = Number(req.query["userId"]); // Fix: Use query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (userId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
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

userRouter.get(
  "/getAppointmentById",
  authorizeRoles("user"),
  async (req, res) => {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
    try {
      const id = Number(req.query["id"]);
      const appointment = await prisma.pastAppointments.findUnique({
        where: { id: id },
      });
      // console.log(appointments);
      res.json(appointment);
    } catch (e) {
      return res.status(400).json({ message: "Error in appointment" });
    }
  }
);

userRouter.post("/forgotPassword", async (req, res) => {
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
    const resetLink = `https://wellness.iiti.ac.in/api/user/reset_password?token=${token}`;
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

userRouter.post("/resetPassword", async (req, res) => {
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

userRouter.post("/setFeedback", authorizeRoles("user"), async (req, res) => {
  const stars = req.body["stars"];
  const id = Number(req.body["id"]);
  const docId = req.body["doctorId"];
  const userId = req.body["userId"];
  if (userId !== req.user.userId) {
    return res.status(403).json({ error: "Access denied" });
  }
  const question1 = req.body["question1"];
  const question2 = req.body["question2"];
  const question3 = req.body["question3"];
  const question4 = req.body["question4"];
  const question5 = req.body["question5"];
  // console.log(id);
  // console.log(docId);
  try {
    const response = await prisma.pastAppointments.update({
      where: {
        id: id,
      },
      data: {
        stars: stars,
        question1: question1,
        question2: question2,
        question3: question3,
        question4: question4,
        question5: question5,
      },
    });

    const setRating = await prisma.pastAppointments.aggregate({
      _avg: {
        stars: true,
      },
      where: {
        doc_id: docId,
      },
    });

    const updateRating = await prisma.doctor.update({
      where: {
        id: docId,
      },
      data: {
        avgRating: setRating._avg.stars,
      },
    });

    // console.log(updateRating)

    // console.log(setRating)

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error in rating update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/check-user", async (req, res) => {
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

userRouter.post("/otpGenerate", async (req, res) => {
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
    const message = `Use the following OTP to verify signup for IITI CalmConnect: ${otp}`;
    sendEmail(email, subject, message);
    res.json({
      message: "OTP sent to your mail!",
    });
  } catch (e) {
    res.json(e);
  }
});

userRouter.post("/otpcheck", async (req, res) => {
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

userRouter.post("/emerApp", async (req, res) => {
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

userRouter.post(
  "/accept-booking-by-user",
  authorizeRoles("user"),
  async (req, res) => {
    const userId = Number(req.body["userId"]);
    const doctorId = Number(req.body["doctorId"]);
    if (userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }
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
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
      });
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
        // console.log(appointment);
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
  }
);

userRouter.get(
  "/isUpcomingAppointment",
  authorizeRoles("user"),
  async (req, res) => {
    const userId = Number(req.query["userId"]);
    if (userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const upcomingAppointment = await prisma.appointments.findFirst({
        where: {
          user_id: userId,
          dateTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          dateTime: "asc",
        },
      });

      if (upcomingAppointment) {
        res.json({
          hasUpcomingAppointment: true,
        });
      } else {
        res.json({ hasUpcomingAppointment: false });
      }
    } catch (error) {
      console.error("Error checking for upcoming appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default userRouter;
