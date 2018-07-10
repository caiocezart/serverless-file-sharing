import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      files: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const files = await this.files();
      this.setState({ files });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  files() {
    return API.get("files", "/files");
  }

  renderFilesList(files) {
    return [{}].concat(files).map(
      (file, i) =>
        i !== 0
          ? <ListGroupItem
            key={file.fileId}
            href={`/files/${file.fileId}`}
            onClick={this.handleFileClick}
            header={file.content.trim().split("\n")[0]}
          >
            {
              "Created: " + new Date(file.createdAt).toLocaleString() + "\n" +
              "Password: " + file.password + "\n" +
              "Password Expiry Date: " + new Date(file.passwordExpiryDate).toLocaleString()
            }
          </ListGroupItem>
          : <ListGroupItem
            key="new"
            href="/files/new"
            onClick={this.handleFileClick}
          >
            <h4>
              <b>{"\uFF0B"}</b> Upload a new File
              </h4>
          </ListGroupItem>
    );
  }

  handleFileClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>File Uploader</h1>
      </div>
    );
  }

  renderFiles() {
    return (
      <div className="files">
        <PageHeader>List of Files</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderFilesTable(this.state.files)}
        </ListGroup>
      </div>
    );
  }

  renderFilesTableRows(files) {
    console.log(files)
    const cursorStyle = {
      'cursor': 'pointer'
    };

    return [{}].concat(files).map(
      (file, i) =>
        i !== 0 ?
          (
            <tr key={i} style={cursorStyle} 
            onClick={this.handleFileClick}           
            href={`/files/${file.fileId}`}>
              <td>{file.content}</td>
              <td>{new Date(file.createdAt).toLocaleString()}</td>
              <td>{file.password}</td>
              <td>{new Date(file.passwordExpiryDate).toLocaleString()}</td>
            </tr>
          ) : null
    );
  }

  renderFilesTable() {
    return (
      <div className="files">
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            href="/files/new"
            text="Upload"
            onClick={this.handleFileClick}
          />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Content</th>
              <th>Created</th>
              <th>Password</th>
              <th>Password Expiration</th>
            </tr>
          </thead>
          <tbody>
            {!this.state.isLoading && this.renderFilesTableRows(this.state.files)}
          </tbody>
        </Table>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderFiles() : this.renderLander()}
      </div>
    );
  }
}