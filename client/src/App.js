import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import sdk from "matrix-js-sdk";

import Login from "./page/Login";
import Rooms from "./page/Rooms";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      client: null,
    };

    this.setClient = this.setClient.bind(this);
  }

  setClient(client) {
    this.setState({ client });
  }

  render() {
    const { client } = this.state;
    const { setClient } = this;

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login client={client} setClient={setClient} />} />
          <Route path="/rooms" element={<Rooms client={client} />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
