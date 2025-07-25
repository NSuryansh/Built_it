import fs from "fs"
import csv from "csv-parser"
import bcrypt from "bcrypt"
import { prisma } from "./server.js";
import crypto from "crypto"

// const prisma = new Prismalient()
const csvFilePath = "./students_data/students.csv"
// const prisma = new Prismalient()
import { generateKeyPairSync } from "crypto";

function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
}

const processCSV = async () => {
  const users = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        users.push(row);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  for (const student of users) {
    const username = "anon" + crypto.randomBytes(3).toString("hex");
    const hashedPassword = await bcrypt.hash(student.Contact_No, 10);
    const { publicKey, privateKey } = generateKeyPair();
    // const publicKeyPEM = await exportKeyToPEM(publicKey);
    // const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
    try {
      await prisma.user.create({
        data: {
          username: username,
          email: student.Email,
          mobile: student.Contact_No,
          password: hashedPassword,
          alt_mobile: "",
          publicKey: publicKey, 
          department: student.Specialization,
          acadProg: student.Program,
          rollNo: student.Roll_Number,
          roomNo: "",
          gender: student.Gender
        },
      });
      console.log("created user, rollNo: ", student.Roll_Number);
    } catch (error) {
      console.error(`error: `, error.message);
    }
  }

  await prisma.$disconnect();
};

processCSV();