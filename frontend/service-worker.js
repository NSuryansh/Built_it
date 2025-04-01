importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js");self.addEventListener("push",o=>{console.log(o);const s=o.data.json();self.registration.showNotification(s.title,{body:s.body,icon:"../assets/final-image.png"})});workbox.precaching.precacheAndRoute([{"revision":null,"url":"assets/index-7FMitsiv.js"},{"revision":null,"url":"assets/index-BVYRHdX9.css"},{"revision":"98ba0d0e4934720e80766926f3ddd362","url":"index.html"},{"revision":"c87bc09bc8c553cdc65803fe4889304c","url":"registerSW.js"},{"revision":"0ea228e7df59c6bb040fe1825d955a7e","url":"sw.js"},{"revision":"9c5a53f066e90c55aef0f05e3e29b9ea","url":"workbox-e3490c72.js"},{"revision":"46f628c0debc48c8542baf45117e07eb","url":"manifest.webmanifest"}]||[]);

// self.addEventListener("push", (event) => {
//   console.log(event)
//   const data = event.data.json();
//   self.registration.showNotification(data.title, {
//     body: data.body,
//     icon: "../assets/final-image.png",
//   });
// });

// const saveSubscription = async(subscription)=>{
//   await fetch("https://built-it-xjiq.onrender.com/save-subscribe", {
//       method: "POST",
//       body: JSON.stringify(subscription),
//       headers: { "Content-Type": "application/json" },
//     })
// }
// const subscribeToPush = async () => {
//   const registration = await navigator.serviceWorker.ready;
//   const subscription = await registration.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: "",
//   });
//   console.log("Push Subscription:", JSON.stringify(subscription));

//   saveSubscription(subscription)
//   return subscription;
// };

// workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);