import React, { Component } from "react";
import { FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import "./Load.css";
import axios from 'axios';
import config from '../config';
import LoaderButton from "../components/LoaderButton";

export default class LoadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            file: null,
            password: ''
        };
    }

    async componentDidMount() {
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        axios.post(`${config.apiGateway.URL}/files/${this.props.match.params.id}/load`, { password: this.state.password })
            .then(res => {
                console.log(res)
                if (res.data.status) {
                    this.setState({
                        file: res.data.message
                    });
                } else {
                    alert(res.data.message);
                    this.props.history.push("/");
                }
            })
            .catch(err => {
                alert('File not found');
                this.props.history.push("/");
            })

        this.setState({
            isLoading: false
        })
    }

    async getFile() {
        return axios.get(`${config.apiGateway.URL}/files/${this.props.match.params.id}/load`)
    }

    render() {
        return this.state.file === null ?
            (
                <div className="Login">
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>File Password</ControlLabel>
                            <FormControl
                                autoFocus
                                onChange={this.handleChange}
                                value={this.state.password}
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
            )
            : (
                <div className="Login">
                    <ControlLabel>Download File Link <small> (expires in 5minutes)</small></ControlLabel>
                    <FormGroup controlId="s3Url">
                        {(<a href={this.state.file.s3Url} target="_blank">Download Link</a>)}
                    </FormGroup>
                </div >
            );
    }
}