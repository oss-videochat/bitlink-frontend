import React from 'react';
import * as Feather from 'react-feather';

import User from "../../../Interface/User";

export default class Member extends React.Component<User> {
    render() {
        return <div className={"member"}>
            <object data={`/usr/image?img=${this.props.profPictureId}`}>
                <Feather.User/>
            </object>
        </div>
    }
}