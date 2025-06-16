// import crypto from "crypto";

// export function encryptMessage(message, key) {
//     const iv = crypto.randomBytes(12);
//     const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
//     let encrypted = cipher.update(message, "utf8", "base64");
//     encrypted += cipher.final("base64");
//     const authTag = cipher.getAuthTag().toString("base64");

//     return { encryptedText: encrypted, iv: iv.toString("base64"), authTag };
// }

// export async function encryptMessage(message, key) {
//     const encoder = new TextEncoder();
//     const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate IV

//     // Import key for AES-GCM
//     const cryptoKey = await window.crypto.subtle.importKey(
//         "raw",
//         key,
//         { name: "AES-GCM" },
//         false,
//         ["encrypt"]
//     );

//     // Encrypt the message
//     const encryptedBuffer = await window.crypto.subtle.encrypt(
//         { name: "AES-GCM", iv },
//         cryptoKey,
//         encoder.encode(message)
//     );

//     return {
//         encryptedText: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
//         iv: btoa(String.fromCharCode(...iv)), // Convert IV to base64
//     };
// }
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
  

export async function encryptMessage(message, key) {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate IV
  
    // Convert key from hex string to Uint8Array
    const keyBuffer = hexStringToUint8Array(key);
  
    // Import key for AES-GCM
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer, // key in correct format
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
  
    // Encrypt the message
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encoder.encode(message)
    );
  
    return {
      encryptedText: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }
  