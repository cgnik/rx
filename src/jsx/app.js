import React from 'react'
import {Row} from 'react-materialize';

import service from './services';
import ServerList from './server-list'
import StandardDeviation from './stddev'
import StandardDeviationList from './stddev-list'
import './style/main.scss'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {server: 'localhost:3000', standardDeviations: []}
        this.refetch()
    }

    refetch() {
        service.listStandardDeviations().then(sds => {
            this.setState({
                standardDeviations: sds || []
            });
        });
    }

    serverChanged(server) {
        this.setState({server: server})
        this.refetch()
    }

    saveStandardDeviation(numberList) {
        service.saveStandardDeviation(numberList).then(sd => {
            this.refetch();
        }).catch(console.error)
    }

    render() {
        return (<div className="container center content-container">
            <Row>
                <h1 className="header center">Standard Deviations</h1>
            </Row>
            <Row>
                <ServerList listener={this.serverChanged.bind(this)}/>
            </Row>
            <Row>
                <StandardDeviation listener={this.saveStandardDeviation.bind(this)}
                                   server={this.state.server}/>
            </Row>
            <StandardDeviationList standardDeviations={this.state.standardDeviations}/>
        </div>);
    }
}

module.exports = App;
