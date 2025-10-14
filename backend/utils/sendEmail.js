import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    // console.log(transporter);

    const info = await transporter.sendMail({
      from: '"Calm Connect" tanveeiii15@gmail.com',
      to,
      subject,
      text,
    });
    // console.log("HELLO")
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
