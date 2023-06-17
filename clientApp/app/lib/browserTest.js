console.log("Loading browser sdk");
const BASE_URL = "http://127.0.0.1:8008";

const deviceId = Math.random().toString(36).substring(2, 15)

const client = matrixcs.createClient({ baseUrl: "http://localhost:8008", deviceId: deviceId });

function login(){
    client.login("m.login.password", {"user": document.forms.user.username.value, "password": document.forms.user.password.value}).then((response) => {
        console.log(response.access_token);
        console.log(response.device_id);
        client.setAccessToken(response.access_token, response.device_id);
        client.startClient();
    
        client.once('sync', function(state, prevState, res) {
            console.log(state); // state will be 'PREPARED' when the client is ready to use
        });
    });
}


let call;

function disableButtons(place, answer, hangup) {
    document.getElementById("hangup").disabled = hangup;
    document.getElementById("answer").disabled = answer;
    document.getElementById("call").disabled = place;
}

function addListeners(call) {
    let lastError = "";
    call.on("hangup", function () {
        disableButtons(false, true, true);
        document.getElementById("result").innerHTML = "<p>Call ended. Last error: " + lastError + "</p>";
    });
    call.on("error", function (err) {
        lastError = err.message;
        call.hangup();
        disableButtons(false, true, true);
    });
    call.on("feeds_changed", function (feeds) {
        const localFeed = feeds.find((feed) => feed.isLocal());
        const remoteFeed = feeds.find((feed) => !feed.isLocal());

        const remoteElement = document.getElementById("remote");
        const localElement = document.getElementById("local");

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

window.onload = function () {
    document.getElementById("result").innerHTML = "<p>Please wait. Syncing...</p>";
    disableButtons(true, true, true);
};

client.on("sync", function (state, prevState, data) {
    switch (state) {
        case "PREPARED":
            document.getElementById("result").innerHTML = "<p>Ready for calls.</p>";
            disableButtons(false, true, true);
        
            var rooms = client.getRooms();
            let list = document.getElementById("rooms");
            rooms.forEach(room => {
                var li = document.createElement('li');
                li.innerText = room.roomId;
                list.appendChild(li);
            });
            break;
    }
});

function syncComplete() {


    document.getElementById("config").innerHTML =
    "<p>" +
    "Homeserver: <code>" +
    BASE_URL +
    "</code><br/>" +
    "Room: <code>" +
    document.forms.chooseRoom.roomId.value +
    "</code><br/>" +
    "User: <code>" +
    document.forms.user.username.value +
    "</code><br/>" +
    "</p>";

    document.getElementById("call").onclick = function () {
        console.log("Placing call...");
        call = matrixcs.createNewMatrixCall(client, document.forms.chooseRoom.roomId.value);
        console.log("Call => %s", call);
        addListeners(call);
        call.placeVideoCall();
        document.getElementById("result").innerHTML = "<p>Placed call.</p>";
        disableButtons(true, true, false);
    };

    document.getElementById("hangup").onclick = function () {
        console.log("Hanging up call...");
        console.log("Call => %s", call);
        call.hangup();
        document.getElementById("result").innerHTML = "<p>Hungup call.</p>";
    };

    document.getElementById("answer").onclick = function () {
        console.log("Answering call...");
        console.log("Call => %s", call);
        call.answer();
        disableButtons(true, true, false);
        document.getElementById("result").innerHTML = "<p>Answered call.</p>";
    };

    client.on("Call.incoming", function (c) {
        console.log("Call ringing");
        disableButtons(true, false, false);
        document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
        call = c;
        addListeners(call);
    });
}

client.on("Room.timeline", function(event, room, toStartOfTimeline){
    if(event.getType() !== "m.room.message"){
        return;
    }
    if(event.getRoomId() === document.forms.chooseRoom.roomId.value){
        document.getElementById("recMessage").innerHTML = event.getContent().body;
    }
});

function sendMessage() {
    var content = {
        "body": document.forms.message.message.value,
        "msgtype": "m.notice"
    };

    client.sendEvent(document.forms.chooseRoom.roomId.value, "m.room.message", content, "", (err, res) => {
        console.log(err);
    });
}