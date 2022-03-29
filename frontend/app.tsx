import React, {ChangeEventHandler} from 'react';
import ReactDOM from 'react-dom';
import { Buffer } from 'buffer';

type AppState = {
    username: string,
    password: string
}

class App extends React.Component<{}, AppState> {
    constructor(prop: {}) {
        super(prop);
        this.state = {
            username: "",
            password: ""
        }

        // functions
        this.onUsernameTextChange = this.onUsernameTextChange.bind(this);
        this.onPasswordTextChange = this.onPasswordTextChange.bind(this);
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
    }

    onUsernameTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: e.target.value});
    }

    onPasswordTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value})
    }

    async login() {
        const loginstr = Buffer.from(`${this.state.username}:${this.state.password}`).toString('base64');
        const rsp = await fetch(`${window.location.origin}/api/testlogin`, {
            method: "GET",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${loginstr}`
            })
        });
        const ret = await rsp.json()
        if (ret.valid) {
            alert('login success!')
        } else {
            alert('login failure!')
        }
    }

    onLoginButtonClick() {
        const _ = this.login();
    }

    render() {
        return (
            <>
                Username:
                <input type="text" value={this.state.username} name="username" onChange={this.onUsernameTextChange} />
                <br />
                Password:
                <input type="password" value={this.state.password} name="pwd" onChange={this.onPasswordTextChange}/>
                <br />
                <button onClick={this.onLoginButtonClick}>Login</button>
            </>
        );
    }
}


const domId = document.querySelector('#login_page');
ReactDOM.render(<App />, domId);
