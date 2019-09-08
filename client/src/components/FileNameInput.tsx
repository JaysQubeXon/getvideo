import React, { SyntheticEvent, FC } from "react";

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

interface FileNameInputProps {
  value: string;
  onEnter: (e: any) => void;
  onChange: (e: SyntheticEvent) => void;
}

const FileNameInput: FC<FileNameInputProps> = ({ value, ...actions }) => {
  const { onEnter, onChange } = actions;
  const styles = {
    label: { color: "white"},
    input: { color: "white", backgroundColor: "#243e3f"}
  };
  return (
    <FormControl style={{ width: 500, color: "#f8f8f8" }} >
      <InputLabel htmlFor="component-error" style={styles.label}>File Name (optional)</InputLabel>
      <Input
        value={value}
        onChange={onChange}
        onKeyPress={onEnter}
        style={styles.input}
        id="component-name-error"
        placeholder="Give your video a name"
        aria-describedby="component-name-text"
      />
    </FormControl>
  )
}

export default FileNameInput;
