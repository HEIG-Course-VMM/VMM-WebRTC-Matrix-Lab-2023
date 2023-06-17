let client = null;
let room = null;
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

  client.on("Room.timeline", function (event, room, toStartOfTimeline) {
    if(event.getType() !== "m.room.message") {
      return;
    }
    console.log(event);
    let message = event.sender.name + ": " + event.event.content.body;
    let textArea = document.getElementById("messagesList");
    textArea.value = textArea.value + "\n" + message; 
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
  call = client.createCall(room.room_id);
  addListeners(call);
  call.placeVideoCall();
}

async function joinRoom() {
  let roomName = prompt("Enter room name:");

  let alias = "#" + roomName + ":vmm.matrix.host";
  let founded_room = await client.getRoomIdForAlias(alias);
  console.log("Room ID: " + founded_room.room_id);
  room = founded_room;
}

function syncComplete() {
  client.on("Call.incoming", async function (c) {
    console.log("Call ringing");
    // document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
    if (confirm("Incoming call...")) {
      call = c;

      addListeners(call);
      call.answer();
    } else {
      c.hangup();
    }
  });
}

function addListeners(call) {
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

async function sendMessage() {
  if (room == null){
    alert("Join a room first");
    return;
  }
  const content = {
    body: document.getElementById("messageInput").value,
    msgtype: "m.text"
  }
  document.getElementById("messageInput").value = "";

  client.sendEvent(room.room_id, "m.room.message", content, "", (err, res) => {
    console.log(err);
  });
}

