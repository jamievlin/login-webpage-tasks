import React, { FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { Buffer } from 'buffer';
import { CdsButton } from "@cds/react/button";
import { CdsInput } from "@cds/react/input";
import { CdsPassword } from "@cds/react/password";
import { CdsFormGroup } from "@cds/react/forms";

import '@cds/core/global.min.css'
import './app.css';

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
        this.onSubmit = this.onSubmit.bind(this);
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

    onSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        this.login().then(() => {
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <CdsFormGroup layout="horizontal" className="LoginForm">
                    <CdsInput>
                        <label>Username</label>
                        <input
                            value={this.state.username}
                            name="username"
                            onChange={this.onUsernameTextChange}
                        />
                    </CdsInput>

                    <CdsPassword>
                        <label>Password</label>
                        <input type="password"
                               value={this.state.password}
                               name="pwd"
                               onChange={this.onPasswordTextChange}
                        />
                    </CdsPassword>
                    <CdsButton type="submit">Login</CdsButton>
                </CdsFormGroup>
            </form>
        );
    }
}

const domId = document.querySelector('#login_page');
ReactDOM.render(<App />, domId);
