import React from "react";
import {Configuration, DefaultApi} from "apis";
import { Task } from "apis/models/Task";
import MsgCards from 'components/msgcards/msgcards';

import '@cds/core/global.min.css';
import './userinfo.less';
import AddTaskDialog from "../components/addtaskdiag";


interface UserInfoState {
    api?: DefaultApi
    username: string
    userid: number
    tasks: Task[]

    hasAddModal: boolean
}

function returnToLogin() {
    window.location.href = `${window.location.origin}/`;
}

class UserInfo extends React.Component<{}, UserInfoState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            api: undefined,
            username: '',
            userid: -1,
            tasks: [],
            hasAddModal: false
        };

        this.setComponentValues = this.setComponentValues.bind(this);
        this.onLogoutBtnClick = this.onLogoutBtnClick.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.postTasks = this.postTasks.bind(this);
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
            console.error('API cannot be undefined!')
            return;
        }

        const updateTasks = async (api?: DefaultApi) => {
            if (api === undefined) {
                return;
            }
            const newTasks = await api.tasksGet({
                userid: this.state.userid
            });
            this.setState({
                tasks: newTasks
            })
        }

        this.state.api.userDataGet().then(rsp => {
            this.setState({
                username: rsp.username,
                userid: rsp.userid
            }, () => { updateTasks(this.state.api).then() })
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

    deleteTask(task: Task) {
        console.log(`deleting task with id ${task.msgId}`);
        this.state.api?.deleteTask({
            userid: this.state.userid,
            taskid: task.msgId
        }).then(_ => {
            let newTaskList = this.state.tasks.filter(t => t.msgId !== task.msgId);
            this.setState({
                tasks: newTaskList
            })}
        ).catch(err => {
            console.error(`err: ${err}`)
        });
    }

    postTasks(text: string): Promise<void> {
        if (this.state.api === undefined) {
            return Promise.reject();
        }

        return this.state.api.taskPost({
            userid: this.state.userid,
            inlineObject: {
                text: text
            }
        }).then(tasks => {
            this.setState({
                tasks: this.state.tasks.concat(tasks)
            })
        }, _ => {
            return Promise.reject()
        })
    }

    renderModal() {
        return this.state.hasAddModal ?
            <AddTaskDialog
                closeFn={() => {
                    this.setState({
                        hasAddModal: false
                    })}
                }
                postTaskFn={this.postTasks}
            />
            : <></>;
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
                <div>
                    { this.renderModal() }
                </div>
                <div cds-layout={"m:md"}>
                    <div className={"app-card-layout"} cds-layout={"grid cols@md:6 cols@lg:3 gap:md"} >
                    { this.state.tasks.map((s) => (
                        <MsgCards key={`task-${s.msgId}`} initMessage={s.text} onDelete={() => this.deleteTask(s)}/>
                    ))}
                    </div>
                </div>
            </div>
        );
    }
}


export default UserInfo;
