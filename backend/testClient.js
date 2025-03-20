import { io } from "socket.io-client";
import crypto from "crypto";

const socket = io("http://localhost:3001");

function generateAESKey() {
    return crypto.randomBytes(32);
}

function encryptMessage(message, key) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(message, "utf8", "base64");
    encrypted += cipher.final("base64");
    const authTag = cipher.getAuthTag().toString("base64");

    return { encryptedText: encrypted, iv: iv.toString("base64"), authTag };
}

const aesKey = generateAESKey();

function decryptMessage(encryptedText, iv, authTag, key) {
    try {
        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            Buffer.from(key, "base64"),
            Buffer.from(iv, "base64")
        );
        decipher.setAuthTag(Buffer.from(authTag, "base64"));

        let decrypted = decipher.update(encryptedText, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Error decrypting message:", error);
        return null;
    }
}

socket.on("connect", () => {
    console.log("Connected to WebSocket server");

    const userId = 14;
    const recId = 15
    socket.emit("register", { userId });
    socket.emit("register", {userId:recId})

    const { encryptedText, iv, authTag } = encryptMessage("Hello, Server!", aesKey);

    socket.emit("sendMessage", {
        senderId: 14,
        recipientId: 15,
        encryptedText,
        iv,
        encryptedAESKey: aesKey.toString("base64"), 
        authTag
    });

    console.log("Message sent:", { encryptedText, iv, authTag });
});

socket.on("receiveMessage", (data) => {
    console.log(data)
    const { senderId, encryptedText, iv, encryptedAESKey } = data
    const decryptedMessage = decryptMessage(
        encryptedText,
        iv,
        data.authTag, 
        encryptedAESKey
    )
    console.log("Received message:", decryptedMessage);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});
