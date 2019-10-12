import * as request from "request";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as fs from "fs";
import { DataCallback } from "./index.d";

const [, , ...flags] = process.argv;

const isWin = flags.includes("--platform=windows") || require("./util").isWin;

// First, look for the download link.
let dir: string, filePath: string;
const defaultBin = path.join(__dirname, "..", "bin");
const defaultPath = path.join(defaultBin, "details");
const url = "https://yt-dl.org/downloads/latest/youtube-dl";

function download(url: string, callback?: DataCallback) {
  let status: Error | null;

  // download the correct version of the binary based on the platform
  url = exec(url);

  request.get(url, { followRedirect: false }, function(
    err: any,
    res: request.Response
  ) {
    if (err) return callback(err);

    if (res.statusCode !== 302) {
      return callback(
        new Error(
          "Did not get redirect for the latest version link. Status: " +
            res.statusCode
        )
      );
    }

    const url = res.headers.location;
    const downloadFile = request.get(url);
    const newVersion = /yt-dl\.org\/downloads\/(\d{4}\.\d\d\.\d\d(\.\d)?)\/youtube-dl/.exec(
      url
    )[1];

    downloadFile.on("response", function response(res: request.Response) {
      if (res.statusCode !== 200) {
        status = new Error("Response Error: " + res.statusCode);
        return;
      }
      downloadFile.pipe(fs.createWriteStream(filePath, { mode: 493 }));
    });

    downloadFile.on("error", function error(err) {
      callback(err);
    });

    downloadFile.on("end", function end() {
      callback(status, newVersion);
    });
  });
}

const exec = (path: string) => (isWin ? path + ".exe" : path);

function createBase(binDir: string) {
  dir = binDir || defaultBin;
  mkdirp.sync(dir);
  if (binDir) mkdirp.sync(defaultBin);
  filePath = path.join(dir, exec("youtube-dl"));
}

export default function downloader(binDir: string, callback: DataCallback) {
  if (typeof binDir === "function") {
    callback = binDir;
    binDir = null;
  }

  createBase(binDir);

  download(url, function error(err, newVersion) {
    if (err) return callback(err);
    fs.writeFileSync(
      defaultPath,
      JSON.stringify({
        version: newVersion,
        path: binDir ? filePath : binDir,
        exec: exec("youtube-dl")
      }),
      "utf8"
    );
    return callback(null, "Downloaded youtube-dl " + newVersion);
  });
}
