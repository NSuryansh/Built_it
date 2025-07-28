import fs from "fs"
import csv from "csv-parser"
import bcrypt from "bcrypt"
import { prisma } from "./server.js";
import crypto from "crypto"

// const prisma = new Prismalient()
const csvFilePath = "./students_data/2025_students_Bdes.csv"
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
    const hashedPassword = await bcrypt.hash(student.Mobile_Number, 10);
    const { publicKey, privateKey } = generateKeyPair();
    // const publicKeyPEM = await exportKeyToPEM(publicKey);
    // const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
    try {
      var gender = "OTHER";
      if(student.Gender == "M"){
        gender = "MALE";
      }else if(student.Gender =="F"){
        gender = "FEMALE";
      }
      await prisma.user.create({
        data: {
          username: username,
          email: student.Email_IDs,
          mobile: student.Mobile_Number,
          password: hashedPassword,
          alt_mobile: "",
          publicKey: publicKey, 
          department: student.Department,
          acadProg: "B.Des.",
          rollNo: student.rollno,
          roomNo: "",
          gender: gender
        },
      });
      console.log("created user, rollNo: ", student.rollno);
    } catch (error) {
      console.error(`error: `, error.message);
    }
  }

  await prisma.$disconnect();
};

processCSV();