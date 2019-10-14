import React, { Suspense, SyntheticEvent, useState, useEffect, ChangeEvent, lazy, useReducer, useRef, useCallback } from 'react';
import Axios from "axios";
import './App.css';

import FormHelperText from '@material-ui/core/FormHelperText';
import { DownloadType } from "./components/DownloadTypeSelect";

const YoutubePlayer = lazy(() => import("./components/youtube"))
const DownloadInput = lazy(() => import("./components/DownloadInput"));
const FileNameInput = lazy(() => import("./components/FileNameInput"));
const DownloadFolderInput = lazy(() => import("./components/DownloadFolderInput"));
const DownloadTypeSelect = lazy(() => import("./components/DownloadTypeSelect"));

interface GetVideoState {
  videoID: string;
  folderName: string;
  error: {
    code: string;
    message: string;
  },
  showFolderName: boolean;
  showVideo: boolean;
  downloadType: DownloadType;
  isDownloading: boolean;
}

const axios = Axios.create({
  baseURL: "http://localhost:1717",
  headers: {
    "Content-Type": "application/json"
  }
});

const GetVideo = () => {
  const [hasVideo, setHasVideo] = useState(false);

  const [fileName, setFileName] = useState("");

  const initialState: GetVideoState = {
    videoID: "",
    folderName: "",
    error: {
      code: "",
      message: ""
    },
    showFolderName: false,
    showVideo: false,
    downloadType: DownloadType.None,
    isDownloading: false
  };

  const downloadInputRed = useRef(null);
  const wavesurferRef = useRef({} as HTMLDivElement);

  const [state, dispatch] = useReducer((state: GetVideoState, action) => {
    switch (action.type) {
      case "SET_VIDEO":
        const valid = (/www\.youtube\.com/).test(action.videoID);
        const videoID = action.videoID;
        if (valid) {
          return { ...state, videoID, error: { code: "", message: "" } };
        } else {
          return { ...state, videoID: "", error: { code: "invalid-videoID", message: "Provide an entire valid youtube url" } };
        }
      case "SHOW_VIDEO":
        // if its passed or toggle feature:
        const showVideo = action.showVideo || !state.showVideo;
        return { ...state, showVideo };
      case "HIDE_VIDEO":
        return { ...state, showVideo: false };
      case "CLEAR_VIDEO_URL":
        return { ...state, videoID: "" };
      case "SET_DOWNLOAD_TYPE":
        return { ...state, downloadType: action.downloadType };
      case "SHOW_FOLDER_NAME":
        return { ...state, showFolderName: !state.showFolderName };
      case "SET_FOLDER_NAME":
        return { ...state, folderName: action.folderName };
      case "REMOVE_FOLDER_NAME":
        return { ...state, folderName: "" };
      case "DOWNLOAD_STARTED":
        return { ...state, isDownloading: true };
      case "DOWNLOAD_FINISHED":
        return { ...state, isDownloading: false };
      case "ON_ERROR":
        return { ...state, error: { code: action.code, message: action.message } };
      case "CLEAR_ERRORS":
        return { ...state, error: { code: "", message: "" } };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    const folderName = localStorage.getItem("getvideo-foldername");
    if (!folderName) {
      dispatch({ type: "ON_ERROR", code: "no-folder-name", message: "Please provide a folder for download" });
    } else {
      dispatch({ type: "SET_FOLDER_NAME", folderName });
      dispatch({ type: "SHOW_FOLDER_NAME" });
    }

    return () => { }
  }, []);

  useEffect(() => {
    console.log("state.videoID", state.videoID);
  }, [state.videoID])

  const resetError = useCallback(() => {
    setTimeout(() => dispatch({ type: "CLEAR_ERRORS" }), 10000);
  }, [dispatch]);

  const handleChange = (event: SyntheticEvent) => {
    let videoID = (event.target as HTMLInputElement).value;
    dispatch({ type: "SET_VIDEO", videoID });
    dispatch({ type: "SHOW_VIDEO", showVideo: true });
  }

  const handlenNameChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let folderName = (event.target as HTMLInputElement).value;
    if (!folderName) {
      dispatch({ type: "ON_ERROR", code: "folder-name-missing", message: "Please provide a folder for downloading content." });
      dispatch({ type: "SET_FOLDER_NAME", folderName });
      resetError();
      return;
    }
    dispatch({ type: "SET_FOLDER_NAME", folderName });
    localStorage.setItem("getvideo-foldername", folderName);
  }

  const handleFileNameChange = (event: SyntheticEvent) => {
    event.preventDefault();
    event.persist();
    let fileNameInput = (event.target as HTMLInputElement).value;
    setFileName(fileNameInput);
  }

  const openFolder = () => {
    axios.post("openFolder", { folderName: state.folderName });
  }

  const onEnter = (e: any) => {
    if (e.charCode === 13) {
      if (state.videoID.length < 0) {
        dispatch({ type: "ON_ERROR", code: "submit-on-enter-invalid-video-id", message: "Please provide a video URL" });
        resetError();
        return;
      }
      download();
    }
  }

  const onFolderNameEnter = (e: any) => {
    if (e.charCode === 13) {
      if (state.folderName.length < 0) {
        dispatch({ type: "ON_ERROR", code: "folder-name-invalid", message: "Please provide download folder" });
        resetError();
        return;
      }
      toggleFolderName();
    }
  }

  const download = () => {
    if (state.error.code) dispatch({ type: "CLEAR_ERRORS" });
    if (!state.folderName) {
      dispatch({ type: "ON_ERROR", code: "submit-on-enter", message: "Please Specify a folder name for output!" });
      resetError();
      return;
    }

    dispatch({ type: "DOWNLOAD_STARTED" });
    axios.post("download", {
      videoURL: state.videoID,
      folderName: state.folderName,
      error: "",
      options: {
        renameFileName: fileName ? fileName : "",
        downloadType: state.downloadType
      }
    })
      .then(({ data: { data } }) => {
        console.log(data);
        if (data.success) {
          dispatch({ type: "ON_ERROR", code: "success", message: "Check your Downloads folder" });
          setHasVideo(data.success);

          if (state.folderName.length > 0) openFolder();
          else
            dispatch({ type: "ON_ERROR", code: "failure", message: "Can't open folder, no folder specified!" })

          resetError();
          dispatch({ type: "DOWNLOAD_FINISHED" });
        }
      })
      .catch((error) => {
        dispatch({ type: "ON_ERROR", code: "network-error", message: "No Network or Server is Disconnected" })
        resetError();
        console.log("Catch-Error:\n", error);
        dispatch({ type: "DOWNLOAD_FINISHED" });
      });
  }

  const toggleFolderName = useCallback(() => {
    dispatch({ type: "SHOW_FOLDER_NAME" });
  }, [dispatch]);

  const handleDownloadTypeChange = useCallback((event: ChangeEvent<any>) => {
    const downloadType = (event.target as HTMLSelectElement).value;
    dispatch({ type: "SET_DOWNLOAD_TYPE", downloadType });
  }, [dispatch]);

  const removeFolderName = useCallback(() => {
    dispatch({ type: "REMOVE_FOLDER_NAME" });
  }, [dispatch])

  return (
    <div className="App">
      <div className="App-header">
        {state.isDownloading && <span style={{ color: "white" }}>Download Started</span>}
        <Suspense fallback={"..loading"}>
          <DownloadInput
            videoID={state.videoID}
            showVideo={state.showVideo}
            folderName={state.folderName}
            onEnter={onEnter}
            handleChange={handleChange}
            ref={downloadInputRed}
            download={download}
          />
          <YoutubePlayer id={state.videoID} />
        </Suspense>
        <div ref={wavesurferRef} />

        <Suspense fallback={"..loading"}>
          {
            true && <FileNameInput onEnter={onEnter} value={fileName} onChange={handleFileNameChange} />
          }
          <DownloadFolderInput
            name={state.folderName}
            show={state.showFolderName}
            toggle={toggleFolderName}
            onKeyPress={onFolderNameEnter}
            onChange={handlenNameChange}
            onClick={removeFolderName}
          />
        </Suspense>
        <FormHelperText
          style={{
            color: "red",
            fontWeight: 700,
            fontSize: 22
          }}
        >
          {state.error.message}
        </FormHelperText>
        {hasVideo &&
          <button onClick={openFolder} className="open-folder">Open Folder</button>
        }

        <Suspense fallback={"...loading"}>
          <DownloadTypeSelect type={state.downloadType} onChange={handleDownloadTypeChange} />
        </Suspense>
      </div>
    </div>
  );

}


export default GetVideo;
