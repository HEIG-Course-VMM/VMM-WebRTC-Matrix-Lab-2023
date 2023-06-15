import React from "react";
import { __RouterContext as RouterContext } from 'react-router-dom';

class Room extends React.Component {
    static contextType = RouterContext;

    render() {
        const { params } = this.context.match;
        const id = params.id;
    
        return (
            <div>
                <h1>Room {id}</h1>
            </div>
        );
    }
}