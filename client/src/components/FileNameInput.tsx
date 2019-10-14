import React, { SyntheticEvent, FC, useState } from "react";

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

interface FileNameInputProps {
  value: string;
  onEnter: (e: any) => void;
  onChange: (e: SyntheticEvent) => void;
}

const FileNameInput: FC<FileNameInputProps> = ({ value, ...actions }) => {
  const [marginTop, setMarginTop] = useState(value.length > 0 ? 1 : 7);

  const { onEnter, onChange } = actions;
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
    if (value.length > 0) {
      setMarginTop(1);
    } else {
      setMarginTop(7);
    }
  }
  return (
    <FormControl style={{ marginLeft: -42, width: 500, color: "#f8f8f8" }} >
      <InputLabel
        htmlFor="component-error"
        variant="filled"
        style={styles.label}
        id="input-label"
      >
        Folder Name (optional)
      </InputLabel>
      <Input
        value={value}
        onChange={onChange}
        onKeyPress={onEnter}
        style={styles.input}
        id="component-name-error"
        placeholder="Give your video a name"
        aria-describedby="component-name-text"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </FormControl>
  )
}

export default FileNameInput;
