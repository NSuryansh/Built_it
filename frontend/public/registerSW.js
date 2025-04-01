window.serviceWorkerRegistration = null;

async function startPWA() {
  try {
    window.serviceWorkerRegistration = await navigator.serviceWorker.register("/sw.js");
  } catch(registrationError) {
    console.log("SW registration failed: ", registrationError);
  }
  console.log("SW registered: ", window.serviceWorkerRegistration);

  try {
    // call what ever starts your PWA here
    // to debug you might do: throw("some error");
    window.localStorage.removeItem("usedBigHammer");
  } catch(ee) {
    await fixWithBigHammer();
  }
}

async function fixWithBigHammer() {
  if (window.localStorage.getItem("usedBigHammer")) {
    window.alert("Problem loading app.  Please contact support.");
    window.localStorage.removeItem("usedBigHammer");
    return;
  }
  if (window.serviceWorkerRegistration) {
    const unregistered = await serviceWorkerRegistration.unregister();
    console.log("SW unregistered");
  }

  const cacheKeys = await window.caches.keys();
  for (key of cacheKeys) {
    console.log("Working on cache: ", key);
    const cache = await caches.open(key);
    const requestKeys = await cache.keys();
    for (request of requestKeys) {
      console.log("Deleting request: ", request);
      await cache.delete(request);
    }
  }
  console.log("Cache deleted");
  window.localStorage.setItem("usedBigHammer", true);
  console.log("Reloading");
  window.location.reload();
  return true;
}

window.addEventListener("load", startPWA);