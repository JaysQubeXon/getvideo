import React, { FC } from "react"

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

interface DownloadFolderInputProps {
  show: boolean;
  toggle: () => void;
  name: string;
  onKeyPress: (e: any) => void;
  onChange: (e: any) => void;
  onClick: (e: any) => void;
}

const DownloadFolderInput: FC<DownloadFolderInputProps> = ({ show, toggle, name, ...actions }) => {
  const { onKeyPress, onChange, onClick } = actions;
  const styles = {
    label: { color: "white" },
    input: { color: "white", backgroundColor: "#243e3f" }
  };
  return (
    <div className="download-folder-input-container">
      <FormControl style={{ width: 500, color: "#f8f8f8" }} >
        <InputLabel htmlFor="component-error" style={styles.label}>Folder Name (Required!)</InputLabel>
        <Input
          value={name}
          style={styles.input}
          onChange={onChange}
          onKeyPress={onKeyPress}
          id="component-name-error"
          aria-describedby="component-name-text"
          placeholder="Required download folder URI"
        />
      </FormControl>
      {show &&
        (
        <button type="button" onClick={onClick} className="download-folder-input-close">
          <span role="img" aria-label="close">❌</span>
        </button>
        )
      }
    </div>
  )
}

export default DownloadFolderInput;
