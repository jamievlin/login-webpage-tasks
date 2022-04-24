import React from "react";
import {CdsCard} from "@cds/react/card";
import {CdsIcon} from "@cds/react/icon";
import {CdsDivider} from "@cds/react/divider";
import {CdsButton} from "@cds/react/button";

import './msgcards.less'

interface MsgCardProps {
    initMessage: string,
    onDelete: () => void,
    onEditClick: () => void
}

const MsgCards = (props: MsgCardProps) => {
    return (
        <CdsCard>
            <div cds-layout={"vertical gap:md"}>
                <h2 cds-text={"section"} cds-layout={"horizontal align:vertical-center"}>
                    <CdsIcon shape={"times"} cds-layout={"align:right"} />
                </h2>

                <div cds-text={"body light"}>
                    { props.initMessage }
                </div>

                <CdsDivider cds-card-remove-margin />
                <div cds-layout={"horizontal gap:md align:vertical-center"}>
                    <CdsButton action={"flat-inline"} onClick={() => props.onEditClick()}>Edit</CdsButton>
                    <CdsButton action={"flat-inline"} onClick={() => props.onDelete()}>Delete</CdsButton>
                </div>
            </div>
        </CdsCard>
    )
}

export default MsgCards;
