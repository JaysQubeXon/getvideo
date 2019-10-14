import React, { FC, useState } from "react"

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
  const [marginTop, setMarginTop] = useState(name.length > 0 ? 1 : 7);
  const styles = {
    label: {
      color: "white",
      marginTop,
      height: 30
    },
    input: { color: "white", backgroundColor: "#243e3f", paddingLeft: 10, height: 40 }
  };

  const onFocus = () => {
    setMarginTop(1);
  }
  const onBlur = () => {
    if (name.length > 0) {
      setMarginTop(1);
    } else {
      setMarginTop(7);
    }
  }
  return (
    <div className="download-folder-input-container">
      <FormControl style={{ width: 500, color: "#f8f8f8" }} >
        <InputLabel
          htmlFor="component-error"
          variant="filled"
          style={styles.label}
        >
          Destination Folder (Required!)
        </InputLabel>
        <Input
          value={name}
          style={styles.input}
          onChange={onChange}
          onKeyPress={onKeyPress}
          id="component-name-error"
          aria-describedby="component-name-text"
          placeholder="Required download folder URI"
          onFocus={onFocus}
          onBlur={onBlur}
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
