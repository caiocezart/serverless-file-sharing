import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Load.css";
import LoaderButton from "../components/LoaderButton";
import axios from 'axios';
import config from '../config';

export default class Load extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            id: ""
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        axios.get(`${config.apiGateway.URL}/files/${this.state.id}/load`)
            .then(res => {
                if (res.status) {
                    this.props.history.push(`/load/${this.state.id}`);
                } else {
                    alert(res.message);
                    this.props.history.push("/load");
                }
            })
            .catch(err => {
                alert('File not found');
                this.props.history.push("/load");
            })

        this.setState({
            isLoading: false
        })
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="id" bsSize="large">
                        <ControlLabel>File Password</ControlLabel>
                        <FormControl
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.id}
                            componentClass="input"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Load File"
                        loadingText="Loading File.."
                    />
                </form>
            </div>
        );
    }
}