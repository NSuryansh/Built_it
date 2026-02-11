// window.ServiceWorkerRegistration = null;

// async function startPWA() {
//   try {
//     window.ServiceWorkerRegistration = await navigator.serviceWorker.register("/sw.js");
//   } catch(registrationError) {
//   }

//   try {
//     // call what ever starts your PWA here
//     // to debug you might do: throw("some error");
//     window.localStorage.removeItem("usedBigHammer");
//   } catch(ee) {
//     await fixWithBigHammer();
//   }
// }

// async function fixWithBigHammer() {
//   if (window.localStorage.getItem("usedBigHammer")) {
//     window.alert("Problem loading app.  Please contact support.");
//     window.localStorage.removeItem("usedBigHammer");
//     return;
//   }
//   if (window.ServiceWorkerRegistration) {
//     const unregistered = await ServiceWorkerRegistration.unregister();
//   }

//   const cacheKeys = await window.caches.keys();
//   for (key of cacheKeys) {
//     const cache = await caches.open(key);
//     const requestKeys = await cache.keys();
//     for (request of requestKeys) {
//       await cache.delete(request);
//     }
//   }
//   window.localStorage.setItem("usedBigHammer", true);
//   window.location.reload();
//   return true;
// }

// window.addEventListener("load", startPWA);
// const send_message_to_sw = (msg) =>
//   new Promise(
//     (resolve, reject) => {
//       // Create a Message Channel
//       const msg_chan = new MessageChannel();

//       // Handler for recieving message reply from service worker
//       msg_chan.port1.onmessage = (event) => {
//           if(event.data.error){
//               reject(event.data.error);
//           }else{
//               resolve(event.data);
//           }
//       };

//       // Send message to service worker along with port for reply
//       navigator.serviceWorker.controller.postMessage(
//         msg
//         , [msg_chan.port2]
//       );
//   }
// );

// document.addEventListener("DOMContentLoaded", () => {
//   document.body.addEventListener("click", () => {
//     send_message_to_sw({
//       action: "delete",
//       cache: /^v1$/,
//       url: /.*bundle.js$/
//     })
//     .then((msg) => console.log("deleted:", msg));
//   });
// });

if ("serviceWorker" in navigator) {
  // Register a service worker hosted at the root of the
  // site using the default scope.
  navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
    (registration) => {
      console.log("Service worker registration succeeded:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}
