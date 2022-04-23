import React, {ChangeEvent} from "react";
import {CdsModal, CdsModalActions, CdsModalHeader} from "@cds/react/modal";
import {CdsButton} from "@cds/react/button";
import {CdsTextarea} from "@cds/react/textarea";
import {CdsControlMessage} from "@cds/react/forms";

interface AddTaskDialogProps {
    closeFn: () => void
    postTaskFn: (taskText: string) => Promise<void>
}

interface AddTaskDialogState {
    text: string
    showErrorText: boolean
}

class AddTaskDialog extends React.Component<AddTaskDialogProps, AddTaskDialogState> {
    constructor(props: AddTaskDialogProps) {
        super(props);
        this.state = {
            text: '',
            showErrorText: false
        };

        this.onChangeTextArea = this.onChangeTextArea.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.renderErrorText = this.renderErrorText.bind(this);
    }

    onChangeTextArea(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: e.target.value
        });
    }

    onSubmitClick() {
        this.props.postTaskFn(this.state.text).then(_ => {
            this.props.closeFn();
        }).catch(_ =>
            this.setState({
                showErrorText: true
            })
        );
    }

    renderErrorText() {
        return this.state.showErrorText ?
            (<CdsControlMessage status={"error"}>Cannot submit task!</CdsControlMessage>) :
            (<></>)
    }

    render() {
        return <CdsModal onCloseChange={this.props.closeFn}>
            <CdsModalHeader>
                <h3 cds-text={"title"}>Add tasks</h3>
            </CdsModalHeader>
            <CdsModalActions>
                <CdsTextarea layout={"vertical"}>
                    <label>Your Task</label>
                    <textarea
                        onChange={this.onChangeTextArea}
                    ></textarea>
                    { this.renderErrorText() }
                </CdsTextarea>
            </CdsModalActions>
            <CdsModalActions>
                <CdsButton onClick={this.onSubmitClick}>Submit</CdsButton>
            </CdsModalActions>
        </CdsModal>
    }
}

export default AddTaskDialog;
