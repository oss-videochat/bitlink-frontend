import React from 'react';

import Message from "./Message";
import APIMessage from '../../../Interface/Message';
import setState from "../../state/stateManager";

type State = {
    messages: APIMessage[]
}

export default class Chat extends React.Component<any, State> {
    state: State = {
        messages: []
    };


    componentDidMount(): void {
        Chat.fetchPrevChat().then((messages: APIMessage[]) => {
            setState({
                messages
            });
            this.setState({
                messages
            });
        });
    }

    static async fetchPrevChat(): Promise<APIMessage[]> {
        // Make API Call here. Fetch messages of current session. Awaiting JBis's API
        return [];
    }

    render() {
        return <div>
            {this.state.messages.map(i => <Message sender={i.sender} timeStamp={i.timeStamp}>{i.messageContent}</Message>)}
        </div>
    }
}