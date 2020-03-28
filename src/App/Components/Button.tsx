import React from 'react';
import * as Feather from 'react-feather';

type Props = { icon: Feather.Icon, tooltip?: string, label?: string, children: () => void };

export default class Button extends React.Component<Props> {
    render() {
        return <button onClick={this.props.children} className={"flex"}>
            <this.props.icon/>
            {this.props.label}

            {(function (tooltip?: string) {
                if (tooltip)
                    // return;
                    return <span className={"tooltip"}>{tooltip}</span>
            })(this.props.tooltip)}
        </button>;
    }
}