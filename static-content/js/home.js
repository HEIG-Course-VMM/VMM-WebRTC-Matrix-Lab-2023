let client = null;
// let device = null;
const ROOM_ID = "!NYJPSxbbXiXSrYlbfr:vmm.matrix.host";
const BASE_URL = "http://localhost:8008";
const DEVICE_ID = "my_device_id";

main();

async function getClient() {
  let token = localStorage.getItem("token");
  if (token == null) {
    window.location.href = "/login.html";
  }
  token = JSON.parse(token);
  let client = await matrixcs.createClient({
    baseUrl: BASE_URL,
    accessToken: token.access_token,
    userId: token.user_id,
    deviceId: DEVICE_ID,
  });
  return client;
}

async function main() {
  console.log("main");
  client = await getClient();
  await client.startClient({ initialSyncLimit: 10 });
  client.once("sync", function (state, prevState, data) {
    switch (state) {
      case "PREPARED":
        console.log("Client synced and ready for use!");
      default:
        console.log("Client state: " + state);
    }
  });

  syncComplete();
}

async function call() {
  // Enable local video stream from camera or screen sharing
  // const localStream = await enable_camera();

  let room = askRoom();
  let alias = "#" + room + ":vmm.matrix.host";
  let founded_room = await client.getRoomIdForAlias(alias);
  console.log("Room ID: " + founded_room.room_id);

  call = client.createCall(founded_room.room_id);
  addListeners(call);
  call.placeVideoCall();
}

function askRoom() {
  let room = prompt("Enter room name:");
  return room;
}

function syncComplete() {
  client.on("Call.incoming", async function (c) {
    console.log("Call ringing");
    // document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
    if (confirm("Incoming call...")) {
      call = c;
      const localStream = await enable_camera();

      addListeners(call);
      call.answer();
    } else {
      c.hangup();
    }
  });
}

async function enable_camera() {
  const constraints = { video: true, audio: true };
  console.log("Getting user media with constraints", constraints);

  // *** TODO ***: use getUserMedia to get a local media stream from the camera.
  //               If this fails, use getDisplayMedia to get a screen sharing stream.
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia();
    } catch (error2) {
      console.error("Error accessing media devices", error);
    }
  }
  document.getElementById("localVideo").srcObject = stream;
  return stream;
}

function addListeners(call) {
  let lastError = "";
  // call.on("hangup", function () {
  //   disableButtons(false, true, true);
  //   document.getElementById("result").innerHTML =
  //     "<p>Call ended. Last error: " + lastError + "</p>";
  // });
  call.on("error", function (err) {
    lastError = err.message;
    call.hangup();
    // disableButtons(false, true, true);
  });
  call.on("feeds_changed", function (feeds) {
    const localFeed = feeds.find((feed) => feed.isLocal());
    const remoteFeed = feeds.find((feed) => !feed.isLocal());

    const remoteElement = document.getElementById("remoteVideo");
    const localElement = document.getElementById("localVideo");

    if (remoteFeed) {
      remoteElement.srcObject = remoteFeed.stream;
      remoteElement.play();
    }
    if (localFeed) {
      localElement.muted = true;
      localElement.srcObject = localFeed.stream;
      localElement.play();
    }
  });
}
