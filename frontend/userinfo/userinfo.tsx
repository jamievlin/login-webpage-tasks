import React from "react";
import {Configuration, DefaultApi} from "../apis";

import MsgCards from 'components/msgcards/msgcards'

import  './userinfo.less';


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

    onLogoutBtnClick() {
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
            <div className={"app-layout"} cds-layout={"vertical align:stretch"}>
                <header className={"app-header"} cds-layout={"horizontal p:md p@md:lg"}>
                    <div>App</div>
                    <a href="#"
                       onClick={this.onLogoutBtnClick}
                       cds-layout={"align:right"}>Logout</a>
                </header>
                <div cds-layout={"m:md"}>
                    <div className={"app-card-layout"} cds-layout={"grid cols@md:6 cols@lg:3 gap:md"} >
                    { ['good','afternoon','everybody'].map((s,i) => (
                        <MsgCards key={s} initMessage={s} onDelete={() => {}}/>
                    ))}
                    </div>
                </div>
            </div>
        );
    }
}


export default UserInfo;
