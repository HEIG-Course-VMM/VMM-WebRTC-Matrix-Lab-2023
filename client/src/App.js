import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import sdk from "matrix-js-sdk";

import Login from "./page/Login";

function App() {

  const [client, setClient] = useState(null);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login client={client} setClient={setClient} />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
