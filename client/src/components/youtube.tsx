import React, { FC } from "react";
import logo from '../logo.svg';

interface YoutubePlayerProps {
  id: string;
}

const YoutubePlayer: FC<YoutubePlayerProps> = ({ id }) => {
  const sanitizeURL = (url: string) => {
    return url.replace("watch?v=", "embed/");
  }
  return (
    <>
      {
        id.length === 0
          ? (
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={logo} className="App-logo" alt="logo" />
            </a>
          )
          : <iframe src={sanitizeURL(id)} className="video-styles" title="selected-video" />
      }
    </>
  )
}

export default YoutubePlayer;
