import React from "react";
import {Input} from 'react-materialize';

export class ServerList extends React.Component {

    handleServerChange(e) {
        (this.props.listener || console.log)(e.target.value);
    }

    render() {
        return (
            <Input label="Choose a Server Implementation" type="select" onChange={(e) => this.handleServerChange(e)}>
                <option value="go">Go</option>
                <option value="java">Java</option>
            </Input>);
    }
}

module.exports = ServerList