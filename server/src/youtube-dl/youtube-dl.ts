import { execFile, ExecFileOptions } from "child_process";
import * as streamify from "streamify";
import * as request from "request";
import * as hms from "hh-mm-ss";
import * as http from "http";
import * as url from "url";

import { isYouTubeRegex, isWin, formatDuration, has, isString } from "./util";
import {
  ProcessDataOptions,
  DataCallback,
  VersionCallback,
  YTDL,
  GetSubsOptions,
  GetThumbsOptions,
  Info
} from "./index.d";

let ytdlBinary = require("./get-library")();

const TEN_MEGABYTES = 1000 * 1000 * 10;

const execFileOpts = { maxBuffer: TEN_MEGABYTES };

function youtubeDl(
  args: string[],
  options: ExecFileOptions,
  cb?: DataCallback
) {
  execFile(ytdlBinary, args, { ...execFileOpts, ...options }, function done(
    err: Error,
    stdout: string,
    stderr: string
  ) {
    if (err) return cb(err);
    return cb(null, stdout.trim().split(/\r?\n/));
  });
}

/**
 * Processes data
 */
function processData(
  data: { [key: string]: any },
  options: ProcessDataOptions,
  stream: any
) {
  const item = !data.length ? data : (data as any[]).shift();

  // fix for pause/resume downloads
  const headers: { [key: string]: any } = Object.assign(
    { Host: url.parse(item.url).hostname },
    data.http_headers
  );

  if (options && options.start > 0 && options.end > 0) {
    headers.Range = `bytes=${options.start}-${options.end}`;
  }

  // @ts-ignore SSL Handshake - ecdhCurve not defined see https://github.com/nodejs/node/issues/16196
  const req = request({ url: item.url, headers: headers, ecdhCurve: "auto" });

  req.on("response", function response(res: request.Response) {
    const size = parseInt(res.headers["content-length"], 10);
    if (size) item.size = size;

    if (options && options.start > 0 && res.statusCode === 416) {
      // the file that is being resumed is complete.
      return stream.emit("complete", item);
    }

    if (res.statusCode !== 200 && res.statusCode !== 206) {
      return stream.emit("error", new Error(`status code ${res.statusCode}`));
    }

    stream.emit("info", item);

    stream.on("end", function end() {
      if (data.length) stream.emit("next", data);
    });
  });

  return stream.resolve(req);
}

/**
 * Downloads a video.
 */
const ytdl: YTDL = function ytdl(
  videoUrl: string,
  args: string[],
  options: ProcessDataOptions
) {
  // @ts-ignore: Undefined Streamify Package
  const stream = streamify({
    superCtor: http.IncomingMessage,
    readable: true,
    writable: false
  });

  if (!isString(videoUrl)) {
    processData(videoUrl as any, options, stream);
    return stream;
  }

  ytdl.getInfo(videoUrl, args, options, function getInfo(
    err: Error,
    data: any
  ) {
    return err ? stream.emit("error", err) : processData(data, options, stream);
  });

  return stream;
};

/**
 * Calls youtube-dl with some arguments and the `cb`
 * gets called with the output.
 */
function call(
  urls: string | string[],
  args1: string[],
  args2: string[],
  options: ExecFileOptions = {},
  cb?: DataCallback
) {
  let args = args1;
  if (args2) args = args.concat(args2);

  // check if encoding is already set
  if (isWin && !args.includes("--encoding")) {
    args.push("--encoding");
    args.push("utf8");
  }

  if (urls !== null) {
    if (isString(urls as string)) urls = [urls as string];

    for (let i = 0; i < urls.length; i++) {
      const video = urls[i];
      if (isYouTubeRegex.test(video)) {
        // Get possible IDs.
        const details = url.parse(video, true);
        let id = details.query.v || "";
        if (id) {
          args.push(`http://www.youtube.com/watch?v=${id}`);
        } else {
          // Get possible IDs for youtu.be from urladdr.
          id = details.pathname.slice(1).replace(/^v\//, "");
          if (id) {
            args.push(video);
            args.unshift("-i");
          }
        }
      } else {
        if (i === 0) args.push("--");
        args.push(video);
      }
    }
  }

  return youtubeDl(args, options, cb);
}

/**
 * Calls youtube-dl with some arguments and the `cb`
 * gets called with the output.
 */
ytdl.exec = function exec(
  url: string,
  args: string[],
  options: ExecFileOptions,
  cb: VersionCallback
) {
  return call(url, [], args, options, cb);
};

function parseInfo(data: string | any): Info {
  // youtube-dl might return just an url as a string when using the "-g" or "--get-url" flag
  if (isString(data) && data.startsWith("http")) {
    data = JSON.stringify({ url: data });
  }

  const info: Info = JSON.parse(data);

  info._duration_raw = info.duration;
  info._duration_hms = info.duration
    ? hms.fromS(info.duration, "hh:mm:ss")
    : info.duration;
  info.duration = info.duration
    ? formatDuration(info.duration as number)
    : info.duration;

  return info;
}

/**
 * Set path from youtube-dl.
 */
ytdl.setYtdlBinary = function setYtdlBinary(path: string) {
  ytdlBinary = path;
};

/**
 * Get path from youtube-dl.
 */
ytdl.getYtdlBinary = function getYtdlBinary() {
  return ytdlBinary;
};

/**
 * Gets info from a video.
 */
ytdl.getInfo = function getInfo(
  url: string,
  args: string[],
  options: ExecFileOptions,
  cb?: DataCallback
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  } else if (typeof args === "function") {
    cb = args;
    options = {};
    args = [];
  }
  const defaultArgs = ["--dump-json"];
  if (
    !args ||
    (!has(args, "-f") &&
      !has(args, "--format") &&
      args.every(function(a) {
        return a.indexOf("--format=") !== 0;
      }))
  ) {
    defaultArgs.push("-f");
    defaultArgs.push("best");
  }

  const done = function done(err: Error, data: any[]) {
    if (err) return cb(err);
    let info;

    // If using the "-g" or "--get-url" flag youtube-dl will return just a string (the URL to the video) which messes up the parsing
    // This fixes this behaviour
    if (has(args, "-g") || has(args, "--get-url")) {
      if (Array.isArray(data) && data.length >= 2) data.splice(0, 1);
    }

    try {
      info = data.map(parseInfo);
    } catch (err) {
      return cb(err);
    }

    return cb(null, info.length === 1 ? info[0] : info);
  };

  call(url, defaultArgs, args, options, done);
};

/**
 * Get Subtitles of a video.
 */
ytdl.getSubs = function getSubs(
  url: string,
  options: GetSubsOptions,
  cb: DataCallback
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  const args = ["--skip-download"];
  args.push("--write" + (options.auto ? "-auto" : "") + "-sub");
  if (options.all) args.push("--all-subs");
  if (options.lang) args.push("--sub-lang=" + options.lang);
  if (options.format) args.push("--sub-format=" + options.format);
  if (!options.warrning) args.push("--no-warnings");

  const done = function done(err: Error, data: string[]) {
    if (err) return cb(err);

    const files = [];

    for (let i = 0; i < data.length; i++) {
      const line = data[i];
      if (line.indexOf("[info] Writing video subtitles to: ") === 0) {
        files.push(line.slice(35));
      }
    }

    return cb(null, files);
  };
  call(url, args, [], { cwd: options.cwd }, done);
};

/**
 * Get Thumbnails of video.
 */
ytdl.getThumbs = function getThumbs(
  url: string,
  options: GetThumbsOptions,
  cb: DataCallback
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  const args = ["--skip-download"];

  if (options.all) args.push("--write-all-thumbnails");
  else args.push("--write-thumbnail");

  if (!options.warrning) args.push("--no-warnings");

  const done = function done(err: Error, data: any[]) {
    if (err) return cb(err);

    const files = [];

    for (let i = 0, len = data.length; i < len; i++) {
      const line = data[i];
      const info = "Writing thumbnail to: ";
      if (has(line, info)) {
        files.push(line.slice(line.indexOf(info) + info.length));
      }
    }

    return cb(null, files);
  };

  call(url, args, [], { cwd: options.cwd }, done);
};

/**
 * Get Extractors.
 */
ytdl.getExtractors = function getExtractors(
  descriptions: boolean,
  options: ExecFileOptions,
  cb: DataCallback
) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  } else if (typeof descriptions === "function") {
    cb = descriptions;
    options = {};
    descriptions = false;
  }

  const args = descriptions
    ? ["--extractor-descriptions"]
    : ["--list-extractors"];

  return call(null, args, null, options, cb);
};

export = ytdl;
