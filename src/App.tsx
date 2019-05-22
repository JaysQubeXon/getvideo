import React, { Component, SyntheticEvent } from 'react';
import logo from './logo.svg';
import Axios from "axios";
import './App.css';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


interface Props {
}
type State = {
  videoID: string;
  error: string;
  folderName: string;
  nameError: string;
  video: boolean;
};

class App extends Component<Props, State> {
  state: State = {
    videoID: "",
    error: "",
    folderName: "",
    nameError: "",
    video: false,
  }

  componentDidMount() {
    const folderName = localStorage.getItem("getvideo-foldername");
    if (!!folderName) {
      this.setState({ folderName });
    }
  }

  public handleChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let videoID = (event.target as HTMLInputElement).value;
    console.log((event.target as HTMLInputElement).value);

    this.setState({ videoID });
  }

  public handlenNameChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let folderName = (event.target as HTMLInputElement).value;
    this.setState(
      { folderName, error: folderName.length > 0 ? "" : "Folder Name is required!" },
      () => localStorage.setItem("getvideo-foldername", folderName)
    );
  }

  public onEnter = (e: any) => {
    if (this.state.folderName.length < 1) {
      this.setState({ error: "Please Specify a folder name for output!" }, this.timeout)
      return;
    }
    this.setState({ error: "" });
    if (e.charCode === 13) {
      console.log("what:", e)
      if (this.state.videoID.length < 0) {
        this.setState({ error: "Please provide a video URL" })
        return;
      }
      Axios.post("http://localhost:1717/download",
        {
          videoURL: this.state.videoID,
          folderName: this.state.folderName.length > 0 ? this.state.folderName : "",
          error: "",
        })
        .then((s) => {
          console.log(s);
          if (s.data.success) {
            this.setState({
              video: s.data.success,
              error: "Check your Downloads folder"
            });
            if (this.state.folderName.length > 0) {
              Axios.post("http://localhost:1717/openFolder",
                { folderName: this.state.folderName });
            } else {
              this.setState({ error: "Can't open folder, no folder specified!" },
                this.timeout
              );
            }
          }
        })
        .catch((error) =>
          this.setState(
            { error: "No Network or Server is Disconnected" },
            this.timeout
          )
        );
    }
  }

  timeout = () => setTimeout(
    () => this.state.error.length > 0 && this.setState({ error: "" }),
    10000);

  public render() {

    return (
      <div className="App">
        <header className="App-header">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <FormControl style={{ width: 500, color: "#f8f8f8" }} >
            <InputLabel htmlFor="component-error">INPUT TO DOWNLOAD A YOUTUBE VIDEO</InputLabel>
            <Input
              onKeyPress={this.onEnter}
              id="component-error"
              value={this.state.videoID}
              onChange={this.handleChange}
              placeholder="example: https://www.youtube.com/watch?v=0LHxvxdRnYc"
              aria-describedby="component-error-text"
            />
          </FormControl>
          <FormControl style={{ width: 500, color: "#f8f8f8" }} >
            <InputLabel htmlFor="component-error">Folder Name (Required!)</InputLabel>
            <Input
              onKeyPress={this.onEnter}
              id="component-name-error"
              value={this.state.folderName}
              onChange={this.handlenNameChange}
              placeholder="Give your video a name"
              aria-describedby="component-name-text"
            />
            In iOS choose a folder starting from <b>/Users/yourusername/desiredFolderURI</b>
          </FormControl>
          <FormHelperText
            style={{
              color: "red",
              fontWeight: 700,
              fontSize: 22
            }}
          >
            {this.state.error}
          </FormHelperText>


        </header>
      </div>
    );
  }
}

export default App;
