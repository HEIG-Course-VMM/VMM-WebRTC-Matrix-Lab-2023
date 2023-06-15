import React from "react";

class Room extends React.Component {

  render() {
    return (
      <div id='mainDiv' align="center">
        <h1>Make free video calls</h1>
        <div id='callButtons' align="center">
            <button id="callButton" onclick="call()">Call</button>
            <button id="hangupButton" onclick="hangUp()">Hang up</button>
        </div>
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
            <textarea id="dataChannelOutput" rows="5" style="width:90%" disabled></textarea>
            <textarea id="dataChannelInput" rows="1" style="width:90%"></textarea>
            <button id="sendButton" onclick="sendMessage()">Send message</button>
        </div>
      </div>
    );
  }
}

export default Room;