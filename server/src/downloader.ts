import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import { spawn, exec } from "child_process";

type DownloadResponse = {
  body: {
    videoURL: string;
    folderName: string;
    options: {
      renameFileName: string;
      downloadType: string;
    };
  };
};

const deleteFIle = (path: string) => {
  console.log("starting to delete:", path);
  fs.unlink(path, err => {
    if (err) throw err;
    console.log("successfully deleted!");
  });
};

const chooseType: { [key: string]: string } = {
  both: "bestvideo[ext=mp4]+bestaudio[ext=m4a]",
  "audio-only": "bestaudio[ext=m4a]",
  "video-only": "bestvideo[ext=mp4]"
};

export const downloader = (req: express.Request, res: express.Response) => {
  console.log("videoURL:", req.body);
  const {
    body: {
      videoURL,
      folderName,
      options: { downloadType, renameFileName }
    }
  }: DownloadResponse = req;

  const type: string[] = ["-f", chooseType[downloadType.toLowerCase()]];

  console.log("Download Type:", type);

  console.log("Starting to download requested video");
  if (folderName.length < 0) {
    res.json({ data: { success: false } });
    console.log("Please provide a folder for download!");
    return;
  }

  console.log("Your Download will be placed in \n", folderName);

  const downloadDestination = (path: string) =>
    `${folderName}/${path ? `${path}/%(title)s.%(ext)s` : `%(title)s.%(ext)s`}`;

  const spot = downloadDestination(renameFileName);
  console.log("spot", spot);
  try {
    console.log("starting download");
    if (renameFileName) {
      const newDir = `${folderName}/${renameFileName}`;
      console.log("newDir", newDir);
      spawn("mkdir", ["-p", newDir]);
    }
    if (type[1]) {
      spawn("youtube-dl", [`-o`, spot, videoURL, ...type]);
    } else {
      spawn("youtube-dl", [`-o`, spot, videoURL]);
    }
    console.log("downloder path",__dirname);
  } catch (error) {
    console.log("EXEC ERROR:", error);
  } finally {
    if (fs.existsSync(path.resolve(__dirname, '..', '~'))) {
      spawn("rm", ["-rf", path.resolve(__dirname, '..', '~')]);
    }
  }
};
