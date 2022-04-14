import React, { FormEvent } from 'react';
import { CdsButton } from "@cds/react/button";
import { CdsInput } from "@cds/react/input";
import { CdsPassword } from "@cds/react/password";
import { CdsFormGroup } from "@cds/react/forms";

import '@cds/core/global.min.css'
import './app.less';

import 'apis';
import {Configuration, DefaultApi} from "apis";

import {CdsAlert, CdsAlertGroup} from "@cds/react/alert";

enum loginState {
    default = 0,
    loginSuccess,
    loginFailed
}

type AppState = {
    username: string,
    password: string,
    loginState: loginState
}

class App extends React.Component<{}, AppState> {
    constructor(prop: {}) {
        super(prop);
        this.state = {
            username: "",
            password: "",
            loginState: loginState.default
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
        defaultApiInst.loginPost().then(rsp => {
            this.setState({loginState: loginState.loginSuccess});
            sessionStorage['session'] = rsp.session
            window.location.href = `${window.location.origin}/userinfo`
        }).catch((err: Response) => {
            this.setState({loginState: loginState.loginFailed});
        });
    }

    onSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        this.login();
    }

    renderAlert(): JSX.Element {
        switch (this.state.loginState) {
            case loginState.loginSuccess:
                return (
                    <CdsAlertGroup status="success">
                        <CdsAlert closable onClick={() => {
                            this.setState({loginState: loginState.default})
                        }}>
                            Login Success!
                        </CdsAlert>
                    </CdsAlertGroup>
                );
            case loginState.loginFailed:
                return (<CdsAlertGroup status="danger">
                    <CdsAlert closable onClick={() => {
                        this.setState({loginState: loginState.default})
                    }}>
                        Login failed!
                    </CdsAlert>
                </CdsAlertGroup>);
            case loginState.default:
            default:
                return (<></>);
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.renderAlert()}
                <CdsFormGroup layout="horizontal" className={"LoginForm"}>
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

export default App;
