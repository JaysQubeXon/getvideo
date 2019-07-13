import React, { SyntheticEvent, useState, useEffect, ChangeEvent } from 'react';
import logo from './logo.svg';
import Axios from "axios";
import './App.css';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


interface Props {
}
type State = {
  videoID: string;
  error: string;
  folderName: string;
  nameError: string;
  video: boolean;
};

function GetVideo() {
  const [videoID, setVideoID] = useState("");
  const [error, setError] = useState({ code: "", message: "" });
  const [folderName, setFolderName] = useState("");
  const [showFolderName, setShowFolderName] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState("both");
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    const storageFolderName = localStorage.getItem("getvideo-foldername");
    if (!storageFolderName) {
      setError({ code: "no-folder-name", message: "Please provide a folder for download" });
    } else {
      setFolderName(storageFolderName);
      setShowFolderName(true);
    }

    return function cleanup() { }
  }, [videoID, error, folderName, hasVideo, downloadType, isDownloading, showVideo, fileName]);

  if (error.code.length > 0 && error.message === "no-folder-name") {
    setError({ code: "initial", message: "Please provide a download folder url so app can work" });
  }

  function resetError() {
    setTimeout(() => setError({ code: "", message: "" }), 10000);
  }

  const handleChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let videoID = (event.target as HTMLInputElement).value;
    setVideoID(videoID);
    setShowVideo(true);
  }

  const handlenNameChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let folderNameInput = (event.target as HTMLInputElement).value;
    if (!folderNameInput) {
      setError({ code: "folder-name-missing", message: "Please provide a folder for downloading content." });
      resetError();
      return;
    }
    setFolderName(folderNameInput);
    localStorage.setItem("getvideo-foldername", folderNameInput);
  }

  const handleFileNameChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let fileNameInput = (event.target as HTMLInputElement).value;
    setFileName(fileNameInput);
  }

  const openFolder = () => {
    Axios.post("http://localhost:1717/openFolder", { folderName });
  }

  const onEnter = (e: any) => {
    if (e.charCode === 13) {
      if (videoID.length < 0) {
        setError({ code: "submit-on-enter-invalid-video-id", message: "Please provide a video URL" });
        resetError();
        return;
      }
      download();
    }
  }

  const onFolderNameEnter = (e: any) => {
    if (e.charCode === 13) {
      if (folderName.length < 0) {
        setError({ code: "folder-name-invalid", message: "Please provide download folder" });
        resetError();
        return;
      }
      toggleFolderName();
    }
  }

  const download = () => {
    if (error.code) setError({ code: "", message: "" });
    if (!folderName) {
      setError({ code: "submit-on-enter", message: "Please Specify a folder name for output!" });
      resetError();
      return;
    }

    setIsDownloading(true);
    Axios.post("http://localhost:1717/download",
      {
        videoURL: videoID,
        folderName,
        error: "",
        options: {
          renameFileName: fileName ? fileName : "",
          downloadType
        }
      })
      .then(({ data: { data } }) => {
        console.log(data);
        if (data.success) {
          setError({ code: "success", message: "Check your Downloads folder" });
          setHasVideo(data.success);

          if (folderName.length > 0) openFolder();
          else
            setError({ code: "", message: "Can't open folder, no folder specified!" })

          resetError();
          setIsDownloading(false);
        }
      })
      .catch((error) => {
        setError({ code: "network-error", message: "No Network or Server is Disconnected" })
        resetError();
        console.log("Catch-Error:\n", error);
        setIsDownloading(false);
      });
  }

  const getVideoID = (url: string) => {
    return url.replace("watch?v=", "embed/");
  }

  const toggleFolderName = () => {
    setShowFolderName(!showFolderName);
  };

  const toggleShowVideoID = () => {
    setShowVideo(!showVideo);
  }

  const handleDownloadTypeChange = (event: ChangeEvent<any>) => {
    setDownloadType((event.target as HTMLSelectElement).value);
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          {isDownloading && "Download Started"}
          {videoID.length === 0
            ? (
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <img src={logo} className="App-logo" alt="logo" />
              </a>
            )
            : <iframe src={getVideoID(videoID)} className="video-styles" title="selected-video" />
          }

          {showVideo && videoID.length > 0
            ? <button onClick={toggleShowVideoID} className="resetVideoID" title={folderName}>Show Video URL</button>
            : (
              <>
                <FormControl style={{ width: 500, color: "#f8f8f8" }} >
                  <InputLabel htmlFor="component-error">INPUT TO DOWNLOAD A YOUTUBE VIDEO</InputLabel>
                  <Input
                    onKeyPress={onEnter}
                    id="component-error"
                    value={videoID}
                    onChange={handleChange}
                    placeholder="example: https://www.youtube.com/watch?v=0LHxvxdRnYc"
                    aria-describedby="component-error-text"
                  />
                </FormControl>
                {
                  videoID.length > 0 &&
                  <button onClick={toggleShowVideoID} className="resetVideoID-side" title={folderName}>X</button>
                }
              </>
            )
          }
          {
            videoID.length > 0 && <button onClick={download} className="resetVideoID" title={folderName}>Download Video</button>
          }

          <FormControl style={{ width: 500, color: "#f8f8f8" }} >
            <InputLabel htmlFor="component-error">File Name (optional)</InputLabel>
            <Input
              onKeyPress={onEnter}
              id="component-name-error"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Give your video a name"
              aria-describedby="component-name-text"
            />
          </FormControl>

          {showFolderName
            ? <button onClick={toggleFolderName} className="reset-video-folder-name" title={folderName}>Change Download Folder</button>
            : (
              <FormControl style={{ width: 500, color: "#f8f8f8" }} >
                <InputLabel htmlFor="component-error">Folder Name (Required!)</InputLabel>
                <Input
                  onKeyPress={onFolderNameEnter}
                  id="component-name-error"
                  value={folderName}
                  onChange={handlenNameChange}
                  placeholder="Required download folder URI"
                  aria-describedby="component-name-text"
                />
                In iOS choose a folder starting from <b>/Users/yourusername/desiredFolderURI</b>
              </FormControl>
            )
          }
          <FormHelperText
            style={{
              color: "red",
              fontWeight: 700,
              fontSize: 22
            }}
          >
            {error.message}
          </FormHelperText>
          {hasVideo &&
            <>
              <button onClick={openFolder} className="open-folder">Open Folder</button>
            </>
          }
          <FormControl className="download-type">
            <InputLabel htmlFor="age-simple">Download Type</InputLabel>
            <Select
              value={downloadType}
              onChange={handleDownloadTypeChange}
              inputProps={{
                name: "download-type",
                id: 'download-type',
              }}
            >
              <MenuItem value="both">Audio {`&`} Video</MenuItem>
              <MenuItem value="video-only">Video Only</MenuItem>
              <MenuItem value="audio-only">Audio Only</MenuItem>
            </Select>
          </FormControl>
        </header>
      </div>
    </>
  );

}

export default GetVideo;
