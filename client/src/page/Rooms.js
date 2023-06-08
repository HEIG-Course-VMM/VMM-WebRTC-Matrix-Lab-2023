import React from "react";

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
                    {rooms.map((room) => <li key={room}>{room}</li>)}
                </ul>
            </div>
        );
    }
}

export default Rooms;