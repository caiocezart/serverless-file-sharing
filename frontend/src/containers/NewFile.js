import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewFile.css";
import { Auth, API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default class NewFile extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleCheckboxChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    const params = {
      attachment: this.file ? await s3Upload(this.file) : null,
      content: this.state.content,
      userName: await Auth.currentAuthenticatedUser().then(user => user.attributes.email)
    }

    await this.createFile(params)
      .then(() => this.props.history.push("/"))
      .catch(err => {
        alert(err);
        this.setState({ isLoading: false });
      });
  }

  createFile(file) {
    return API.post("files", "/files", {
      body: file
    });
  }

  render() {
    return (
      <div className="NewFile">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="input"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" multiple />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Upload"
            loadingText="Uploading.."
          />
        </form>
      </div>
    );
  }
}