import React from 'react';
import User from "../../Interface/User";
import * as Feather from "react-feather";
import isDev from "../../API/isDev";

export default class UserImg extends React.Component<{user: User}, any> {
    render() {
        return <object data={isDev() ? "" : `/usr/image?img=${this.props.user.profPictureId}`}>

            {/* Due to React Dev Server, we can't make API requests to a local API. In other words, we can't request the image. Instead, the rendered React App will be returned. */}
            {/* This is fixed in Production mode*/}
            {/* This is going to be changed next chance I get, but we need a backend server first. So for now, it's just a dummy image*/}

            <Feather.User/>
        </object>;
    }
}