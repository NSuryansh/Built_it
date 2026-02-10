// import crypto from "crypto";

// export function decryptMessage(encryptedText, iv, authTag, key) {
//     try {
//             const decipher = crypto.createDecipheriv(
//                 "aes-256-gcm",
//                 Buffer.from(key, "base64"),
//                 Buffer.from(iv, "base64")
//             );
//             decipher.setAuthTag(Buffer.from(authTag, "base64"));

//             let decrypted = decipher.update(encryptedText, "base64", "utf8");
//             decrypted += decipher.final("utf8");

//             return decrypted;
//         } catch (error) {
//             console.error("Error decrypting message:", error);
//             return null;
//         }
//     }
import { encryptMessage } from "./encryptMessage";
// import { generateAESKey } from "./aeskey";
function hexStringToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hexString");
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    arrayBuffer[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return arrayBuffer;
}
// testCrypto();

export async function decryptMessage(encryptedText, iv, key) {
  const decoder = new TextDecoder();
  const keyBuffer = hexStringToUint8Array(key);

  // Import the key for AES-GCM decryption
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  // Convert iv from base64 to Uint8Array
  const ivBuffer = new Uint8Array(
    [...atob(iv)].map((char) => char.charCodeAt(0)),
  );

  // Convert encrypted text from base64 to Uint8Array
  const encryptedBuffer = new Uint8Array(
    [...atob(encryptedText)].map((char) => char.charCodeAt(0)),
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    cryptoKey,
    encryptedBuffer,
  );

  return decoder.decode(decryptedBuffer);
}

// async function testCrypto() {
//     const key = generateAESKey(); // returns a hex string
//     const plainText = "Hello World!";
//     const { encryptedText, iv } = await encryptMessage(plainText, key);
//     const decryptedText = await decryptMessage(encryptedText, iv, key);
//   }
