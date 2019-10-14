import React, { FC } from "react";

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

export enum DownloadType {
  None = "none",
  Both = "both",
  Video_Only = "Video-Only",
  Audio_Only = "Audio-Only"
}

interface DownloadTypeSelectProps {
  type: string;
  onChange: (e: any) => void;
}

const DownloadTypeSelect: FC<DownloadTypeSelectProps> = ({ type, ...actions }) => {
  const { onChange } = actions;
  const styles = {
    label: { color: "white"},
    input: { color: "white", backgroundColor: "#243e3f"}
  };
  return (
    <FormControl className="download-type">
      <InputLabel htmlFor="age-simple" style={styles.label}>Download Type</InputLabel>
      <Select
        value={type}
        onChange={onChange}
        style={styles.input}
        inputProps={{
          name: "download-type",
          id: 'download-type',
        }}
      ><MenuItem value={DownloadType.None}>Single File</MenuItem>
        <MenuItem value={DownloadType.Both}>Separate Audio {`&`} Video</MenuItem>
        <MenuItem value={DownloadType.Video_Only}>Video Only</MenuItem>
        <MenuItem value={DownloadType.Audio_Only}>Audio Only</MenuItem>
      </Select>
    </FormControl>
  )
}

export default DownloadTypeSelect;
