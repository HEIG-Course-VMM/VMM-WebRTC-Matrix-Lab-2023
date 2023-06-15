import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./page/Login";
import Rooms from "./page/Rooms";
import Home from "./page/Home";

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
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login client={client} setClient={setClient} />} />
            <Route path="/rooms/:roomID" element={!client ? <Navigate to="/login" /> : <Rooms client={client} />} />
            <Route path="/rooms" element={!client ? <Navigate to="/login" /> : <Rooms client={client} />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </>
    )
  }
}

export default App;
