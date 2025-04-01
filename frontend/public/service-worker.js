importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js");

self.addEventListener("push", (event) => {
  console.log(event)
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "../assets/final-image.png",
  });
});

// const saveSubscription = async(subscription)=>{
//   await fetch("https://built-it-xjiq.onrender.com/save-subscribe", {
//       method: "POST",
//       body: JSON.stringify(subscription),
//       headers: { "Content-Type": "application/json" },
//     })
// }
const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "",
  });
  console.log("Push Subscription:", JSON.stringify(subscription));

  saveSubscription(subscription)
  return subscription;
};

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);