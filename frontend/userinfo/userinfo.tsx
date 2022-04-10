import React, {MouseEvent} from "react";
import '@cds/core/global.min.css'
import './userinfo.css';
import {Configuration, DefaultApi} from "../apis";


interface UserInfoState {
    api?: DefaultApi
    username: string
}

function returnToLogin() {
    window.location.href = `${window.location.origin}/`;
}

class UserInfo extends React.Component<{}, UserInfoState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            api: undefined,
            username: ''
        };

        this.setComponentValues = this.setComponentValues.bind(this);
        this.onLogoutBtnClick = this.onLogoutBtnClick.bind(this);
    }

    componentDidMount() {
        const session = sessionStorage.getItem('session')
        if (session === null) {
            console.error('not logged in... ');
            returnToLogin();
        } else {
            const defaultApiCfg = new Configuration({
                accessToken: session
            });
            this.setState({api: new DefaultApi(defaultApiCfg)}, this.setComponentValues);
        }
    }

    setComponentValues() {
        if (this.state.api === undefined) {
            return;
        }

        this.state.api.userDataGet().then(rsp => {
            this.setState({username: rsp.username});
        })
    }

    onLogoutBtnClick(ev: MouseEvent<HTMLButtonElement>) {
        console.log('hello?')
        this.state.api?.deleteSession().then(() => {
            sessionStorage.removeItem('session');
            returnToLogin();
        }).catch(err => {
            console.log('???')
            console.log(`err: ${err}`)
        })
    }

    render() {
        return (
            <>
            Welcome, {this.state.username}.
            <button onClick={this.onLogoutBtnClick}>logout</button>
            </>
        );
    }
}


export default UserInfo;
