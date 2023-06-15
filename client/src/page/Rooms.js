import React from "react";
import { Link } from "react-router-dom";

class Rooms extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: [],
        };
    }

    componentDidMount() {
        const { client } = this.props;
        client.once("sync", (state, prevState, res) => {
            const rooms = client.getRooms();
            this.setState({ rooms: rooms.map((room) => room.name) });
        });
    }

    render() {
        const { rooms } = this.state;
        return (
            <div>
                <h1>Rooms</h1>
                <ul>
                    {rooms.map((room) => <Link to={`/rooms/${room}`}><li>{room}</li></Link>)}
                </ul>
            </div>
        );
    }
}

export default Rooms;