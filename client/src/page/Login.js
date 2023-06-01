import { useState } from 'react';
import sdk from "matrix-js-sdk";

function Login({ client, setClient }) {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleLogin = (event) => {
        event.preventDefault();
        const newClient = sdk.createClient({ baseUrl: "http://localhost:8008" });
        client.login("m.login.password", {"user": username, "password": password}).then((response) => {
            console.log(response);
            setClient(newClient);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" onChange={handleUsername} />
                <input type="password" placeholder="Password" onChange={handlePassword} />
                <button onClick={handleLogin}>Login</button>
            </form>
        </div>
    );
}

export default Login;