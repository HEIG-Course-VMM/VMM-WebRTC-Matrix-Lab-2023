import React from "react";
import { useState, useEffect } from "react";

function Rooms({ client }) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        console.log(client);
        client.once("sync", (state, prevState, res) => {
            setRooms(res.rooms.join);
        });
    }, [client]);

    return (
        <div>
            <h1>Rooms</h1>
            <ul>
                {rooms.map((room) => <li key={room}>{room}</li>)}
            </ul>
        </div>
    );
}

export default Rooms;