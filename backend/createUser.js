import fs from "fs"
import csv from "csv-parser"
import bcrypt from "bcrypt"
import { prisma } from "./server.js";

// const prisma = new Prismalient()
const csvFilePath = "./students_data/students.csv"
// const prisma = new Prismalient()

  async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    return keyPair;
  }

  async function exportKeyToPEM(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );
    return exportedAsBase64.match(/.{1,64}/g).join("\n");
  }

  async function exportPrivateKeyToPEM(privateKey) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    const exportedAsBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exported))
    );
    return exportedAsBase64.match(/.{1,64}/g).join("\n");
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
    const { publicKey, privateKey } = await generateKeyPair();
    const publicKeyPEM = await exportKeyToPEM(publicKey);
    const privateKeyPEM = await exportPrivateKeyToPEM(privateKey);
    try {
      await prisma.user.create({
        data: {
          username: username,
          email: student.Email,
          mobile: student.Contact_No,
          password: hashedPassword,
          alt_mobile: "",
          publicKey: publicKeyPEM, 
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