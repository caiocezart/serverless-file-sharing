import React, { Component } from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import "./Load.css";
import axios from 'axios';
import config from '../config';

export default class LoadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            id: ""
        };
    }

    async componentDidMount() {
        await this.getFile()
            .then(res => {
                console.log(res);
                if (res.data.status) {
                    const { s3Url } = res.data.message;

                    this.setState({
                        s3Url,
                        isLoading: false
                    });
                } else {
                    alert(res.data.message);
                    this.props.history.push("/load");
                }
            })
            .catch(err => {
                alert(err);
                this.props.history.push("/load");
            });
    }

    async getFile() {
        return axios.get(`${config.apiGateway.URL}/files/${this.props.match.params.id}/load`)
    }

    render() {
        return (
            <div className="Login">
                <ControlLabel>Download File Link <small> (expires in 5minutes)</small></ControlLabel> 
                <FormGroup controlId="s3Url">
                    {this.state.s3Url ? (<a href={this.state.s3Url} target="_blank">Download Link</a>) : null}
                </FormGroup>
            </div >
        );
    }
}