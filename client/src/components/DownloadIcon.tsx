import React, { FC } from "react";

interface DownloadIcon {
  fill: string;
  onClick: () => any;
}

const DownloadIcon: FC<DownloadIcon> = ({ fill, onClick }) => {
  return (
    <div style={{ marginLeft: 5 }} onClick={onClick}>
      <svg
        width="32"
        height="31"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 31.04">
        <g fill={fill}>
          <g>
            <path
              d="M33.34,21.52a2.42,2.42,0,0,0-2.66,2.09v3.25H5.32V23.61a2.42,2.42,0,0,0-2.66-2.09A2.42,2.42,0,0,0,0,23.61V29A2.42,2.42,0,0,0,2.66,31H33.34A2.42,2.42,0,0,0,36,29V23.61A2.42,2.42,0,0,0,33.34,21.52Z" /><path d="M17.2,23.74a1.35,1.35,0,0,0,1.6,0l9.32-7.32a.63.63,0,0,0,.21-.82,1,1,0,0,0-.88-.46H23.08V1.63A1.9,1.9,0,0,0,21,0H15a1.89,1.89,0,0,0-2.07,1.63V15.14H8.55a1,1,0,0,0-.88.46.63.63,0,0,0,.21.82Z" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default DownloadIcon;
