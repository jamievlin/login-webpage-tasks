import React, { FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { CdsButton } from "@cds/react/button";
import { CdsInput } from "@cds/react/input";
import { CdsPassword } from "@cds/react/password";
import { CdsFormGroup } from "@cds/react/forms";

import '@cds/core/global.min.css'
import './app.css';

import '../apis';
import {Configuration, DefaultApi} from "../apis";

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

    login() {
        const defaultApiInst = new DefaultApi(new Configuration({
            username: this.state.username,
            password: this.state.password
        }));
        defaultApiInst.testLoginGet().then(rsp => alert(`valid: ${rsp.valid}`));
    }

    onSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        this.login();
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
