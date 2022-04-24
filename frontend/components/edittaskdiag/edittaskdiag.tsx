import React, {ChangeEvent} from "react";
import {CdsModal, CdsModalActions, CdsModalHeader} from "@cds/react/modal";
import {CdsButton} from "@cds/react/button";
import {CdsTextarea} from "@cds/react/textarea";
import {CdsControlMessage} from "@cds/react/forms";
import { DefaultApi } from 'apis';

export interface EditTaskDialogProps {
    closeFn: () => void
    postTaskFn: (taskText: string) => Promise<void>

    userId: number
    msgId: number
    msgText: string

    api: DefaultApi
}

export interface EditTaskDialogState {
    text: string
    showErrorText: boolean
}

export class EditTaskDialog extends React.Component<EditTaskDialogProps, EditTaskDialogState> {
    constructor(props: EditTaskDialogProps) {
        super(props);
        this.state = {
            text: this.props.msgText,
            showErrorText: false,
        };

        this.submitTask = this.submitTask.bind(this);
        this.renderErrorText = this.renderErrorText.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onChangeTextArea = this.onChangeTextArea.bind(this);
    }

    onChangeTextArea(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: e.target.value
        });
    }

    async submitTask() {
        await this.props.api.patchTask({
            userid: this.props.userId,
            taskid: this.props.msgId,
            inlineObject1: {
                text: this.state.text
            }
        });
        await this.props.postTaskFn(this.state.text);
        this.props.closeFn();
    }

    onSubmitClick() {
        this.submitTask().then()
    }

    renderErrorText() {
        return this.state.showErrorText
            ? (<CdsControlMessage status={"error"}>Cannot submit task!</CdsControlMessage>)
            : null
    }

    render() {
        return <CdsModal onCloseChange={this.props.closeFn}>
            <CdsModalHeader>
                <h3 cds-text={"title"}>Edit tasks</h3>
            </CdsModalHeader>
            <CdsModalActions>
                <CdsTextarea layout={"vertical"}>
                    <label>Your Task</label>
                    <textarea onChange={this.onChangeTextArea}>
                        { this.state.text }
                    </textarea>
                    { this.renderErrorText() }
                </CdsTextarea>
            </CdsModalActions>
            <CdsModalActions>
                <CdsButton onClick={this.onSubmitClick}>Submit</CdsButton>
            </CdsModalActions>
        </CdsModal>
    }
}
