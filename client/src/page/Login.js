import React from "react";
import sdk from "matrix-js-sdk";
import {
    Navigate,
} from "react-router-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            success: false,
        };
    }

    handleUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    handleLogin = (event) => {
        event.preventDefault();

        const deviceId = Math.random().toString(36).substring(2, 15)

        const newClient = sdk.createClient({ baseUrl: "http://localhost:8008", deviceId: deviceId });
        newClient.login("m.login.password", {"user": this.state.username, "password": this.state.password}).then((response) => {
            newClient.setAccessToken(response.access_token, response.device_id);
            newClient.startClient();
            this.props.setClient(newClient);
            this.setState({ success: true });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { handleUsername, handlePassword, handleLogin } = this;
        const { success } = this.state;

        if (success) {
            return <Navigate to="/rooms" />;
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
}

export default Login;