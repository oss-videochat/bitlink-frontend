import React from 'react';

import APIMessage from '../../../Interface/Message';
import UserImg from "../UserImg";
import Moment from "react-moment";
import User from "../../../Interface/User";

const relativeCalendar = {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : '[last] dddd [at] LT',
    nextWeek : 'dddd [at] LT',
    sameElse : 'L'
};

type MessageInterface = {
    sender: User,
    timeStamp: Date,
    children: string | number[]
}

export const stringify = (charList: number[]): string => charList.map(i => String.fromCodePoint(i)).join('');

export function convertToReactProps(msg: APIMessage): MessageInterface { // in case a message is received in API form
    return {
        sender: msg.sender,
        timeStamp: msg.timeStamp,
        children: stringify(msg.messageContent)
    };
}

export default (props: MessageInterface) => <div className={"message"}>
    <UserImg user={props.sender}/>
    <div className={"message-container"}>
        <span>{props.sender.userName}</span>
        <p>{typeof props.children === "string" ? props.children : stringify(props.children)}</p>
    </div>
    <div className={"time"}>
        <Moment locale={"au"} calendar={relativeCalendar}>{props.timeStamp}</Moment>
    </div>
</div>;