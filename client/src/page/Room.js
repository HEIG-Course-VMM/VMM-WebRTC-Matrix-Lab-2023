import React from "react";
import { useParams } from "react-router-dom";
import sdk from "matrix-js-sdk";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class Room extends React.Component {

  constructor(props) {
    super(props);
    this.call = null;
  }

  disableButtons = (place, answer, hangup)  => {
    document.getElementById("hangupButton").disabled = hangup;
    document.getElementById("answerButton").disabled = answer;
    document.getElementById("callButton").disabled = place;
  }

  addListeners = (call) => {
    let lastError = "";
    call.on("hangup", function () {
        this.disableButtons(false, true, true);
        document.getElementById("result").innerHTML = "<p>Call ended. Last error: " + lastError + "</p>";
    });
    call.on("error", function (err) {
        lastError = err.message;
        call.hangup();
        this.disableButtons(false, true, true);
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

  syncComplete = () => {
    document.getElementById("result").innerHTML = "<p>Ready for calls.</p>";
    this.disableButtons(false, true, true);

    document.getElementById("callButton").onclick = function () {
        console.log("Placing call...");
        const { roomId } = this.props.params;
        this.call = sdk.createNewMatrixCall(client, roomId);
        console.log("Call => %s", this.call);
        this.addListeners(this.call);
        this.call.placeVideoCall();
        document.getElementById("result").innerHTML = "<p>Placed call.</p>";
        this.disableButtons(true, false, false);
    };

    document.getElementById("hangupButton").onclick = function () {
        console.log("Hanging up call...");
        console.log("Call => %s", this.call);
        this.call.hangup();
        document.getElementById("result").innerHTML = "<p>Hungup call.</p>";
    };

    document.getElementById("answerButton").onclick = function () {
        console.log("Answering call...");
        console.log("Call => %s", this.call);
        this.call.answer();
        this.disableButtons(true, true, false);
        document.getElementById("result").innerHTML = "<p>Answered call.</p>";
    };

    const { client } = this.props;
    client.on("Call.incoming", function (c) {
        console.log("Call ringing");
        this.disableButtons(true, false, false);
        document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
        this.call = c;
        this.addListeners(this.call);
    });
  }

  render() {
    return (
      <div id='mainDiv' align="center">
        <h1>Make free video calls</h1>
        <div id='callButtons' align="center">
            <button id="callButton">Call</button>
            <button id="hangupButton">Hang up</button>
            <button id="answerButton">Answer</button>
        </div>
        <div id="result"></div>
        <h3>Streams and data channels</h3>
        <table class="pure-table pure-table" width="90%">
            <thead>
                <tr>
                    <th>Local video</th>
                    <th>Remote video</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td width="50%"> <video id="localVideo" autoplay mute playsinline width="100%"></video> </td>
                    <td width="50%"> <video id="remoteVideo" autoplay playsinline width="100%"></video> </td>
                </tr>
            </tbody>
        </table>
        <div id='chat' align="center">
            <h3>Chat</h3>
            <textarea id="dataChannelOutput" rows="5" style={{width:"90%"}} disabled></textarea>
            <textarea id="dataChannelInput" rows="1" style={{width:"90%"}}></textarea>
            <button id="sendButton" onclick="sendMessage()">Send message</button>
        </div>
      </div>
    );
  }
}

export default withParams(Room);