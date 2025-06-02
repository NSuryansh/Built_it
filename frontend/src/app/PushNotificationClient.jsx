"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import dotenv from "dotenv";

dotenv.config();

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};

const PushNotificationsClient = () => {
  const [type, setType] = useState(null);

  const SERVER_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;
  const convertedVapidKey = urlBase64ToUint8Array(SERVER_KEY);

  useEffect(() => {
    setType(localStorage.getItem("user_type"));
    onMessage(messaging, async (payload) => {
      console.log("Foreground message received:", payload);

      if (
        Notification.permission === "granted" &&
        "serviceWorker" in navigator
      ) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.showNotification(
            payload.notification?.title || "Notification",
            {
              body: payload.notification?.body || "",
              icon: "https://res.cloudinary.com/dt7a9meug/image/upload/v1745488000/final-logo_l1fg7i.jpg",
            }
          );
          console.log("Notification shown");
        } else {
          console.error("No service worker registration found.");
        }
      }
    });

    setTimeout(() => {
      const userid = localStorage.getItem("userid");
      const userType = localStorage.getItem("user_type");
      requestNotificationPermission(userid, userType);
    }, 4000);
  }, []);

  const subscribeToPush = async (userid, userType) => {
    const registration = await navigator.serviceWorker.ready;
    const fcmToken = await getToken(messaging, {
      vapidKey: SERVER_KEY,
    });

    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      await fetch("http://localhost:3000/common/save-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, subscription: fcmToken, userType }),
      });
    }
  };

  const requestNotificationPermission = async (userid, userType) => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    }
    subscribeToPush(userid, userType);
  };

  return null; // This component does not render UI
};

export default PushNotificationsClient;
