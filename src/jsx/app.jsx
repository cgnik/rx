import React from 'react'
import ReactDOM from 'react-dom'
import {
    Button,
    ButtonToolbar,
    Jumbotron,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Panel,
    Grid, Row, Col
} from 'react-bootstrap'

export class AppHeader extends React.Component {
    render() {
        return (
            <Jumbotron>
                <h2>Standard Deviation testing page</h2>
                <br/>
            </Jumbotron>)
    }
}

export class ListStdDevs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {server: props.server, standardDeviations: props.standardDeviations}
    }

    render() {
        return (
            <div>
                <Panel collapsible defaultExpanded header="Existing Standard Deviations List">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={1} md={1}><h3>ID</h3></Col>
                            <Col xs={4} md={4}><h3>Standard Deviation</h3></Col>
                            <Col xs={6} md={6}><h3>Data Point Input</h3></Col>
                        </Row>
                        {this.state.standardDeviations.map((sd) => {
                            return (
                                <Row className="show-grid" key={sd.id}>
                                    <Col xs={1} md={1}>{sd.id}</Col>
                                    <Col xs={4} md={4}>{sd.answer}</Col>
                                    <Col xs={6} md={6}>{sd.points.join(', ')}</Col>
                                </Row>
                            )
                        })}
                    </Grid>
                </Panel>
            </div>
        )
    }

}
export class NewStdDevForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            server: props.server,
            value: '',
            validationState: '',
            valid: true,
            listener: props.newStandardDeviationListener
        }
        this.validation = {valid: true, message: ""}
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    getPointsList(value) {
        return value.replace(new RegExp(',', 'g'), '').split(" ")
    }

    handleValidation() {
        let invalids = this.getPointsList(this.state.value).filter(isNaN)
        if (invalids.length > 0) {
            this.validation.valid = false
            console.log("invalid");
            return "error"
        }
        this.validation.valid = true
        return "success"
    }

    handleSubmit(e) {
        e.preventDefault()
        let self = this
        try {
            let points = self.getPointsList(this.state.value).filter(self.isNumeric).map(parseFloat)
            let postdata = JSON.stringify({points: points})
            var request = new Request('http://' + this.state.server + '/standardDeviation', {
                method: 'POST',
                mode: 'cors',
                body: postdata
            });
            fetch(request).then((response) => {
                return response.json();
            }).then((newStandardDeviation) => {
                self.setState({value: ''})
                if (self.state.listener) {
                    self.state.listener(newStandardDeviation)
                }
            });
        } catch (e) {

        }
    }

    render() {
        return (<div className="std-dev-input-form">
            <form>
                <FormGroup controlId="formBasicText" validationState={this.handleValidation()}>
                    <ControlLabel>Enter a list of numbers</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Example: 28.232 28.442 187.644 38.1 192.0 37"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <ButtonToolbar>
                    <Button disabled={!this.validation.valid} onClick={(e) => this.handleSubmit(e)}>Add Standard
                        Deviation</Button>
                </ButtonToolbar>
            </form>
        </div>)
    }
}

export class ServerChoice extends React.Component {

    constructor(props) {
        super(props)
        this.state = {server: 'localhost:3000', listener: props.serverChangeListener}
    }

    handleServerChange(e) {
        console.log(e.target.value);
        this.setState({server: e.target.value})
        if (this.state.listener) {
            this.state.listener(e.target.value);
        }
    }

    render() {
        return (
            <FormGroup controlId="formControlsSelectMultiple">
                <ControlLabel>Select Server</ControlLabel>
                <FormControl componentClass="select" onChange={(e) => this.handleServerChange(e)}>
                    <option value="localhost:3000">Go</option>
                    <option value="localhost:3002">Ruby</option>
                </FormControl>
            </FormGroup>
        )
    }
}

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {server: 'localhost:3000', standardDeviations: []}
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        let self = this;
        fetch('http://' + this.state.server + '/standardDeviation').then((sds) => sds.json()).then((sds) => {
            self.setState({
                standardDeviations: sds
            });
            self.standardDeviationList.setState({standardDeviations: sds})
        });
    }

    serverChanged(server) {
        this.setState({server: server})
        this.standardDeviationList.setState({server: server})
        this.newStandardDeviationList.setState({server: server})
    }

    newStandardDeviation(standardDeviation) {
        this.standardDeviationList.setState((prevState, props) => {
            prevState.standardDeviations.unshift(standardDeviation)
            return {standardDeviations: prevState.standardDeviations};
        });
    }

    render() {
        return (<div>
            <AppHeader/>
            <ServerChoice serverChangeListener={this.serverChanged.bind(this)}/>
            <NewStdDevForm newStandardDeviationListener={this.newStandardDeviation.bind(this)}
                           server={this.state.server}
                           ref={(r) => this.newStandardDeviationList = r}/>
            <ListStdDevs standardDeviations={[]} server={this.state.server}
                         ref={(r) => this.standardDeviationList = r}/>
        </div>);
    }
}

ReactDOM.render(<App/>, document.getElementById("main-react-container"))
