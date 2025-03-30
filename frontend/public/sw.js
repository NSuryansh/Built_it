if (!self.define) { let e, s = {}; const i = (i, n) => (i = new URL(i + ".js", n).href, s[i] || new Promise((s => { if ("document" in self) { const e = document.createElement("script"); e.src = i, e.onload = s, document.head.appendChild(e) } else e = i, importScripts(i), s() })).then((() => { let e = s[i]; if (!e) throw new Error(`Module ${i} didn’t register its module`); return e }))); self.define = (n, r) => { const t = e || ("document" in self ? document.currentScript.src : "") || location.href; if (s[t]) return; let o = {}; const l = e => i(e, t), d = { module: { uri: t }, exports: o, require: l }; s[t] = Promise.all(n.map((e => d[e] || l(e)))).then((e => (r(...e), o))) } } define(["./workbox-e3490c72"], (function (e) { "use strict"; self.addEventListener("message", (e => { e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting() })), e.precacheAndRoute([{ url: "assets/index-BuVDknNh.js", revision: null }, { url: "assets/index-JuTYsraS.css", revision: null }, { url: "index.html", revision: "d5b56d676fac9dcee7f27cf1584b5502" }, { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" }, { url: "manifest.webmanifest", revision: "a42f6840a3d29eca07ef7555e96a3efd" }], {}), e.cleanupOutdatedCaches(), e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))) }));

self.addEventListener("push", (event) => {
    console.log(event)
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "../assets/final-image.png",
    });
  });

  const saveSubscription = async(subscription)=>{
    await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      })
  }
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
  