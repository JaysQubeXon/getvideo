import * as fs from 'fs';
import { ExecFileOptions } from "child_process"


const youtubedl = require('@microlink/youtube-dl');

type DownloadResponse = { body: { videoURL: string; folderName: string } };

const SIX_HOUNDRED_MEGABYTES = 1000 * 1000 * 600;

export function downloader({ body: { videoURL, folderName } }: DownloadResponse, res: any) {
  console.log("Starting to download requested video");
  if (folderName.length < 0) {
    res.json({ data: { success: false }});
    console.log("Please provide a folder for download!");
    return;
  }
  console.log("Your Download will be placed in \n", folderName);
  youtubedl.exec(
    videoURL,
    ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]'],
    {
      cwd: folderName,
      // encoding: "buffer",
      maxBuffer: SIX_HOUNDRED_MEGABYTES,
    } as ExecFileOptions,
    function execYTDL(err: any, output: string[]) {
    'use strict';
    if (err) { throw err; }
    console.log(output.join('\n'));

    res.json({ data: { success: true }});
  });
}
