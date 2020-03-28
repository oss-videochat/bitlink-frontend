import React from 'react';
import * as Feather from "react-feather";
import Button from "./Components/Button";

import VideoFeed from "./Components/VideoFeed";
import Chat from "./Components/Chat";
import Participants from "./Components/Participants/index";

import * as StateManager from './state/stateManager';
import State from "./state/globState"; // import for TypeScript's sake. It's not crucial, but better to.

export default class App extends React.Component<any, any> {

    state: {
        isChatCollapsed: boolean
    } = {
        isChatCollapsed: false
    };

    componentDidMount(): void {
        StateManager.on('toggleChat', (prev: State) => this.setState({isChatCollapsed: prev.isChatCollapsed}));
        // ^ Listen for collapse requests. In the callback of any state manager listeners, the state at the current moment in time is passed as the only parameter to the callback.
        // This means that the chat's visibility will be stored in the global chat and on change, updates the local state of the `App` object.
        // Since local state changes trigger rerenders, we rather use the local state.
    }

    render() {
        return <div>
            <VideoFeed/>

            <Button icon={Feather.Maximize} tooltip={"FullScreen"} label={"Full Screen"}>
                {function () {
                    StateManager.dispatch("toggleFullScreen", (prev: State) => ({
                        fullScreen: !prev.fullScreen
                    }))
                }}
            </Button>

            <Button icon={Feather.MessageSquare} tooltip={"Show Chat"} label={"Chat"}>
                {function() {
                    StateManager.dispatch("toggleChat", (prev: State) => ({
                        isChatCollapsed: !prev.isChatCollapsed
                    }))
                }}
            </Button>

            {(function (render: boolean) {
                if (render)
                    return <section className={"chat"}>
                        <Participants/>
                        <Chat/>
                    </section>;
            })(!this.state.isChatCollapsed)}
        </div>;
    }
};
