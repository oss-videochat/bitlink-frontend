import React from 'react';
import {observer} from "mobx-react"
import {Reactions} from "../../../enum/Reactions";
import {Reaction} from "../../../stores/MessagesStore";

interface ReactionArrayObj {
    [key: string]: Array<Reaction>
}

@observer
export class ReactionsDisplayer extends React.Component<any, any> {
    private reactionsArrays: ReactionArrayObj = {};

    constructor(props: any) {
        super(props);
        Object.values(Reactions).forEach(value => {
            this.reactionsArrays[value] = [];
        });
        this.props.reactions.forEach((reaction: Reaction) => {
            this.reactionsArrays[reaction.type].push(reaction);
        });
    }

    render() {
        return null;
    }
}
