import React from "react";
import '@cds/core/global.min.css'
import './userinfo.css';
import {Configuration, DefaultApi} from "../apis";


interface UserInfoState {
    api?: DefaultApi
    username: string
}

class UserInfo extends React.Component<{}, UserInfoState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            api: undefined,
            username: ''
        }

        this.setComponentValues = this.setComponentValues.bind(this)
    }

    componentDidMount() {
        const session = sessionStorage.getItem('session')
        if (session === null) {
            console.error('not logged in... ')
            window.location.href = `${window.location.origin}/`

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

    render() {
        return (
            <>Welcome, {this.state.username}</>
        );
    }
}


export default UserInfo;
