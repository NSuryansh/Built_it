import { initializeApp } from "firebase/app";
import { getToken, onMessage } from "firebase/messaging";

let messaging = null;

// Only import messaging in the browser
if (typeof window !== "undefined") {
  const { getMessaging } = require("firebase/messaging");

  const firebaseConfig = {
    apiKey: "AIzaSyAmaUTaZr1rp_2kYzu4jEOo859YEA4OVls",
    authDomain: "vitality-71a0e.firebaseapp.com",
    projectId: "vitality-71a0e",
    storageBucket: "vitality-71a0e.firebasestorage.app",
    messagingSenderId: "908490427241",
    appId: "1:908490427241:web:e4b7f255fddae0f4cb4bf8",
    measurementId: "G-HLPJEN5M00",
  };

  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}
export { messaging, getToken, onMessage };
