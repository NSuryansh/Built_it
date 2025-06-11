import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., smtp.gmail.com
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"IITI CalmConnect" tanveeiii15@gmail.com',
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
