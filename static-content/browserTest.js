console.log("Loading browser sdk");

const BASE_URL = "http://localhost:8008";
const TOKEN = "syt_dXNlcjE_fhqYFqUYLRdHyjZkTgyh_0kOGi6";
const USER_ID = "@user1:vmm.matrix.host";
const USER_PSW = "user1";

const ROOM_ID = "!tcCQobxnDOHnIOGmdY:vmm.matrix.host";
const DEVICE_ID = "ABCDEFGF";


//const client = matrixcs.createClient({
   // baseUrl: BASE_URL,
   // accessToken: TOKEN,
   // userId: USER_ID,
   // deviceId: DEVICE_ID,
//});


let client;



async function login(){
    client =  matrixcs.createClient({baseUrl:BASE_URL, deviceId: DEVICE_ID});
    
    let id = document.getElementById('username').value; 
    let pass = document.getElementById('password').value; 


    console.log("Debut login");

    response = await client.login("m.login.password", {"user": id, "password": pass});

    console.log("LOGIN");

    console.log("Access token: " + response.access_token);

    console.log("Device id: " + response.device_id);

    client.setAccessToken(response.access_token);
    

    client.startClient();

    client.on("sync", function (state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
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
    document.getElementById("config").innerHTML =
        "<p>" +
        "Homeserver: <code>" +
        BASE_URL +
        "</code><br/>" +
        "Room: <code>" +
        ROOM_ID +
        "</code><br/>" +
        "User: <code>" +
        USER_ID +
        "</code><br/>" +
        "</p>";
    disableButtons(true, true, true);
};



function syncComplete() {
    document.getElementById("result").innerHTML = "<p>Ready for calls.</p>";
    disableButtons(false, true, true);

    document.getElementById("call").onclick = function () {
        console.log("Placing call...");
        call = matrixcs.createNewMatrixCall(client, ROOM_ID);
        console.log("Call => %s", call);
        addListeners(call);

        //let stream = navigator.mediaDevices.getDisplayMedia({video: true});

        call.placeVideoCall();
        //call.updateLocalUsermediaStream(stream);

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

    client.on("event", function(event){
        console.log(event.getType());
        console.log(event);
    });
}


