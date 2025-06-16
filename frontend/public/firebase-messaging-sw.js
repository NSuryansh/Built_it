importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAmaUTaZr1rp_2kYzu4jEOo859YEA4OVls",
  authDomain: "vitality-71a0e.firebaseapp.com",
  projectId: "vitality-71a0e",
  messagingSenderId: "908490427241",
  appId: "1:908490427241:web:e4b7f255fddae0f4cb4bf8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log(payload.notification)
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://res.cloudinary.com/dt7a9meug/image/upload/v1745488000/final-logo_l1fg7i.jpg', 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
