import * as fs from "fs";
import { ExecFileOptions, execSync } from "child_process";

const youtubedl = require("@microlink/youtube-dl");

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

const SIX_HOUNDRED_MEGABYTES = 1000 * 1000 * 600;

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
    fs.renameSync("~"+oldPath, "~"+newPath);
  } catch (err) {
    console.log(err);
  }
};

export function downloader(req: DownloadResponse, res: any) {
  const {
    body: {
      videoURL,
      folderName,
      options: { downloadType, renameFileName }
    }
  } = req;
  let type = "";

  if (downloadType === "both") type = "bestvideo[ext=mp4]+bestaudio[ext=m4a]";
  if (downloadType === "audio-only") type = "bestaudio[ext=m4a]";
  if (downloadType === "video-only") type = "bestvideo[ext=mp4]";

  console.log("Download Type:", type);

  console.log("Starting to download requested video");
  if (folderName.length < 0) {
    res.json({ data: { success: false } });
    console.log("Please provide a folder for download!");
    return;
  }

  const option = {
    cwd: folderName,
    // encoding: "buffer",
    maxBuffer: SIX_HOUNDRED_MEGABYTES
  } as ExecFileOptions;

  console.log("Your Download will be placed in \n", folderName);

  const ytFn = function execYTDL(err: any, output: string[]) {
    "use strict";
    if (err) {
      throw err;
    }
    console.log(output.join("\n"));

    if (output.length > 0) {
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
  };

  youtubedl.exec(videoURL, ["-f", type], option, ytFn);
}
