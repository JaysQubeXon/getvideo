import React, { FC, SyntheticEvent, forwardRef } from "react";

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import DownloadIcon from "./DownloadIcon";

type ReactEvent = (e: SyntheticEvent) => void;

interface DownloadInputProps {
  videoID: string;
  showVideo: boolean;
  folderName: string;
  onEnter: (e: any) => void;
  handleChange: ReactEvent;
  download: () => any;
}

const DownloadInput: FC<DownloadInputProps> = ({ videoID, showVideo, folderName, ...actions }, ref) => {
  const { onEnter, handleChange, download } = actions;
  const styles = {
    label: { color: "white" },
    input: {
      color: "white",
      backgroundColor: "#243e3f",
      marginBottom: 10
    }
  };
  const downloadIconFill = videoID.length > 0 ? "green" : "gray"
  return (
    <div className="download-input-container">
      <FormControl style={{ width: 500, color: "#f8f8f8" }} >
        <InputLabel
          htmlFor="component-error"
          focused={true}
          variant="filled"
          style={styles.label}>Download URL</InputLabel>
        <Input
          value={videoID}
          id="component-error"
          onKeyPress={onEnter}
          style={styles.input}
          onChange={handleChange}
          aria-describedby="component-error-text"
          placeholder="example: https://www.youtube.com/watch?v=0LHxvxdRnYc"
        />
      </FormControl>
      <DownloadIcon fill={downloadIconFill} onClick={download} />
    </div>
  )
}

export default forwardRef(DownloadInput);
