if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}

const send_message_to_sw = (msg) =>
  new Promise(
    (resolve, reject) => {
      // Create a Message Channel
      const msg_chan = new MessageChannel();

      // Handler for recieving message reply from service worker
      msg_chan.port1.onmessage = (event) => {
          if(event.data.error){
              reject(event.data.error);
          }else{
              resolve(event.data);
          }
      };

      // Send message to service worker along with port for reply
      navigator.serviceWorker.controller.postMessage(
        msg
        , [msg_chan.port2]
      );
  }
);

document.body.addEventListener(
  "click"
  ,()=>
    send_message_to_sw(
      {
        action:"delete"
        ,cache:/^v1$/
        ,url:/.*bundle.js$/
      }
    )
    .then(
      (msg)=>
        console.log("deleted:",msg)
    )
);
