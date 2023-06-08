import React from "react";
import sdk from "matrix-js-sdk";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
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
        const newClient = sdk.createClient({ baseUrl: "http://localhost:8008" });
        newClient.login("m.login.password", {"user": this.state.username, "password": this.state.password}).then((response) => {
            console.log(response);
            newClient.setAccessToken(response.access_token, response.device_id);
            newClient.startClient();
            console.log(newClient);
            console.log(this.props);
            this.props.setClient(newClient);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const { handleUsername, handlePassword, handleLogin } = this;
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