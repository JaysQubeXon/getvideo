import * as fs from "fs";
import * as express from "express";

import { ytdl } from "./youtube-dl";

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

const renameFile = (oldPath: string, newPath: string) => {
  console.log("starting to rename:", oldPath);
  console.log("Rename to:", newPath);
  try {
    fs.renameSync("~" + oldPath, "~" + newPath);
  } catch (err) {
    console.log(err);
  }
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
  const type: string = chooseType[downloadType];

  console.log("Download Type:", type);

  console.log("Starting to download requested video");
  if (folderName.length < 0) {
    res.json({ data: { success: false } });
    console.log("Please provide a folder for download!");
    return;
  }

  const option: any = { cwd: folderName };

  console.log("Your Download will be placed in \n", folderName);

  function execYTDL(err: any, output: any) {
    if (err) {
      console.log("error here");
      throw err;
    }
    console.log(output.join("\n"));

    /**
     * 
     * if (output.length > 0) {
      if (renameFileName && renameFileName.length > 0) {
        console.log("Selected rename for file:", renameFileName);
        let name = "";
        for (let i = 0; i < output.length; i++) {
          if (/has already been downloaded/.test(output[i])) {
            break;
          }

          let filename = /mp4|m4a/.test(output[i]);

          if (filename) {
            let part = output[i].split(": ");

            // part[0] = `[download] Destination: `
            // part[1] = filename
            let noExt = part[1].split(".")[0];
            console.log("what is noExt:", noExt);
            // file extention removed and only name added.
            name = noExt;
            break;
          } else {
            continue;
          }
        }
        let o = folderName + `/${name}`;
        let n = folderName + `/${renameFileName}`;

        console.log("\nwhat is old filename:", o);
        console.log("what is new filename:", n);
        console.log("\n");

        const t = 1000 * 10;
        if (downloadType === "both") {
          console.log(downloadType);
          setTimeout(() => {
            renameFile(`${o}.mp4`, `${n}.mp4`);
            renameFile(`${o}.m4a`, `${n}.m4a`);
          }, t);
        }
        if (downloadType === "video-only") {
          console.log(downloadType);
          setTimeout(() => renameFile(`${o}.mp4`, `${n}.mp4`), t);
        }
        if (downloadType === "audio-only") {
          console.log(downloadType);
          setTimeout(() => renameFile(`${o}.m4a`, `${n}.m4a`), t);
        }
      }
      res.json({ data: { success: true } });
      console.log("\n");
    }
     */
  }

  // return;
  try {
    ytdl.exec(videoURL, ["-f", type], option, execYTDL);
  } catch (error) {
    console.log("EXEC ERROR:", error);
  }
};
