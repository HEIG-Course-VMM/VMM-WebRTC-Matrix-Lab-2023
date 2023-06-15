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
        this.state = {
            connected: false,
            chat: [],
            input: "",
            call: null,
        };
    }

    componentDidMount() {
        const { client } = this.props;
        const { roomId } = this.props.params;
        client.joinRoom(roomId).then((response) => {
            console.log("Joined room %s", roomId);
            this.setState({ connected: true });

            client.on("Room.timeline", (event, room) => {
                if (event.event.type === "m.room.message") {
                    const sender = event.sender.name;
                    const message = event.event.content.body;
                    const { chat } = this.state;
                    chat.push(`${sender}: ${message}`);
                    this.setState({ chat });
                }
            });

            client.on("Call.incoming", (call, room) => {
                console.log("Call ringing");
                const { roomId } = this.props.params;
                if (call.roomId === roomId) {
                    console.log("Call ringing in this room");
                    this.addListeners(call);
                    this.disableButtons(true, false, false);
                    this.setState({ call });
                }
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ connected: false });
        });
    }

    handleInput = (event) => {
        this.setState({ input: event.target.value });
    }

    disableButtons = (place, answer, hangup)  => {
        document.getElementById("hangupButton").disabled = hangup;
        document.getElementById("answerButton").disabled = answer;
        document.getElementById("callButton").disabled = place;
    }

  addListeners = (call) => {
    let lastError = "";
    call.on("hangup", () => {
        this.disableButtons(false, true, true);
        this.setState({ call: null });

        const remoteElement = document.getElementById("remoteVideo");
        const localElement = document.getElementById("localVideo");

        remoteElement.srcObject = null;
        localElement.srcObject = null;
    });
    call.on("error", (err) => {
        lastError = err.message;
        call.hangup();
        this.disableButtons(false, true, true);
    });
    call.on("feeds_changed", (feeds) => {
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

  placeCall = () => {
    console.log("Placing call...");
    const { roomId } = this.props.params;
    const { client } = this.props;
    const call = client.createCall(roomId);
    
    console.log("Call => %s", call);
    this.addListeners(call);
    call.placeVideoCall();
    this.disableButtons(true, false, false);

    this.setState({ call });
  }

  hangup = () => {
    console.log("Hanging up call...");
    const { call } = this.state;
    call.hangup();
    document.getElementById("result").innerHTML = "<p>Hungup call.</p>";
  }

  answer = () => {
    console.log("Answering call...");
    const { call } = this.state;
    call.answer();
    this.disableButtons(true, true, false);
    document.getElementById("result").innerHTML = "<p>Answered call.</p>";
  }

  syncComplete = () => {
    document.getElementById("result").innerHTML = "<p>Ready for calls.</p>";
    this.disableButtons(false, true, true);

    const { client } = this.props;
    client.on("Call.incoming", function (c) {
        console.log("Call ringing");
        this.disableButtons(true, false, false);
        document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
        this.call = c;
        this.addListeners(this.call);
    });
  }

    sendMessage = (e) => {
        e.preventDefault();
        const { client } = this.props;
        const { roomId } = this.props.params;
        const { input } = this.state;
        const message = {
            "msgtype": "m.text",
            "body": input,
        }
        this.setState({ input: "" });
        client.sendEvent(roomId, "m.room.message", message).then((response) => {
            console.log("Sent message");
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

  render() {
      const { client } = this.props;
      const { connected } = this.state;

      if (!connected) {
          return <h1>Failing to connect to room</h1>;
      }

      return (
          <div id='mainDiv' align="center">
              <h1>Make free video calls</h1>
              <div id='callButtons' align="center">
                  <button id="callButton" onClick={this.placeCall}>Call</button>
                  <button id="hangupButton" onClick={this.hangup}>Hang up</button>
                  <button id="answerButton" onClick={this.answer}>Answer</button>
              </div>
              <div id="result"></div>
              <h3>Streams and data channels</h3>
              <table className="pure-table pure-table" width="90%">
                  <thead>
                      <tr>
                          <th>Local video</th>
                          <th>Remote video</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td width="50%"> <video id="localVideo" autoPlay playsInline width="100%"></video> </td>
                          <td width="50%"> <video id="remoteVideo" autoPlay playsInline width="100%"></video> </td>
                      </tr>
                  </tbody>
              </table>
              <div id='chat' align="center">
                  <h3>Chat</h3>
                  <form>
                    <textarea style={{width:"90%", minHeight: "300px"}} value={this.state.chat.join("\n")} readOnly disabled />
                    <input id="dataChannelInput" type="text" onChange={this.handleInput} value={this.state.input} />
                    <input id="sendButton" onClick={this.sendMessage} type="submit" value="Send" />
                  </form>
              </div>
          </div>
      );
  }
}

export default withParams(Room);