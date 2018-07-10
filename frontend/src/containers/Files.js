import React, { Component } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Files.css";

export default class Files extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            isSigning: null,
            file: null,
            content: "",
            passwordExpiryDate: '',
            s3Url: '',
            attachment: '',
            fileId: ''
        };
    }

    async componentDidMount() {
        await this.getFile()
            .then(file => {
                const { attachment, content, fileId, passwordExpiryDate, s3Url } = file;

                this.setState({
                    attachment,
                    file,
                    content,
                    fileId,
                    passwordExpiryDate,
                    s3Url
                });

                this.setState({
                    isLoading: false,
                    isDeleting: false,
                    isSigning: false
                })
            })
            .catch(err => {
                alert('File not found');
                this.props.history.push("/");
            });
    }

    async getFile() {
        const file = await API.get("files", `/files/${this.props.match.params.id}`)
            .catch(err => {
                alert('File not found');
                this.props.history.push("/");
            });

        return file;
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    saveFile() {
        return API.put("files", `/files/${this.props.match.params.id}`);
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await this.saveFile({});
            this.componentDidMount();
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    async generateS3Url() {
        return API.put("files", `/files/${this.props.match.params.id}/sign`);
    }

    handleS3 = async event => {
        event.preventDefault();

        this.setState({
            isSigning: true
        });

        await this.generateS3Url()
            .then(res => {
                console.log(res);
                if (!res.status) {
                    alert(res.message);
                    this.setState({
                        isSigning: false
                    })
                } else {
                    this.componentDidMount();
                }

            })
            .catch(error => {
                alert(error);
            });;
    }

    deleteFile() {
        return API.del("files", `/files/${this.props.match.params.id}`);
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this file?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteFile();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }

    render() {
        return (
            <div className="Files" >
                {
                    this.state.file &&
                    <form onSubmit={this.handleSubmit}>
                        <ControlLabel>Description</ControlLabel>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="input"
                            />
                        </FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <FormGroup controlId="password">
                            <FormControl
                                readOnly
                                value={this.state.fileId}
                                componentClass="input"
                            />
                        </FormGroup>
                        <ControlLabel>Password Expiry Date</ControlLabel>
                        <FormGroup controlId="passwordExpiryDate">
                            <FormControl
                                readOnly
                                value={new Date(this.state.passwordExpiryDate)}
                                componentClass="input"
                            />
                        </FormGroup>
                        <ControlLabel>S3 Signed Link</ControlLabel>
                        <FormGroup controlId="s3Url">
                            {this.state.s3Url ? (<a href={this.state.s3Url} target="_blank">Download Link</a>) : null}
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Extend File Expiry Date"
                            loadingText="Extending file expiry date.."
                        />
                        <LoaderButton
                            block
                            bsStyle="warning"
                            bsSize="large"
                            onClick={this.handleS3}
                            isLoading={this.state.isSigning}
                            text="Create S3 Link"
                            loadingText="Creating S3 Signed Link"
                        />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…"
                        />
                    </form>
                }
            </div>
        );
    }
}