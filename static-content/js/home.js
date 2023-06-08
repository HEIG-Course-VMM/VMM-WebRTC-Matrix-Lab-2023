let client = null;
const ROOM_ID = "!NYJPSxbbXiXSrYlbfr:vmm.matrix.host";
const BASE_URL = "http://localhost:8008";

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
  });
  return client;
}

async function main() {
  client = await getClient();
}

async function call() {
  // Enable local video stream from camera or screen sharing
  const localStream = await enable_camera();

  let room = askRoom();
  const rooms = await client.getRooms();
  console.log(rooms);

  // matrixcs.createNewMatrixCall(client, ROOM_ID);
}

function askRoom() {
  let room = prompt("Enter room name:");
  return room;
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
