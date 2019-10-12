// Arguments we dont want users to use with youtube-dl
// because they will break the module.
const badArgs = [
  "-h",
  "--help",
  "-v",
  "--version",
  "-U",
  "--update",
  "-q",
  "--quiet",
  "-s",
  "--simulate",
  "-g",
  "--get-url",
  "-e",
  "--get-title",
  "--get-id",
  "--get-thumbnail",
  "--get-description",
  "--get-duration",
  "--get-filename",
  "--get-format",
  "-j",
  "--dump-json",
  "--newline",
  "--no-progress",
  "--console-title",
  "-v",
  "--verbose",
  "--dump-intermediate-pages",
  "--write-pages",
  "--print-traffic"
];

/**
 * Helps parse options used in youtube-dl command.
 */
const parseOpts = function(args: string[]): string[] {
  var pos;
  for (var i = 0, len = badArgs.length; i < len; i++) {
    if ((pos = args.indexOf(badArgs[i])) !== -1) {
      args.splice(pos, 1);
    }
  }
  return args;
};

/**
 * Converts seconds to format hh:mm:ss
 */
const formatDuration = function(seconds: number): string {
  var parts = [];
  parts.push(seconds % 60);
  var minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    parts.push(minutes % 60);
    var hours = Math.floor(minutes / 60);
    if (hours > 0) {
      parts.push(hours);
    }
  }
  return parts.reverse().join(":");
};

/**
 * Checks wether str is a string or not
 */
const isString = (str: string): boolean => typeof str === "string";

/**
 * Checks arr contains value
 */
const has = (arr: string[], value: string): boolean =>
  arr && arr.indexOf(value) > -1;

const isYouTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;

const isWin =
  process.platform === "win32" || process.env.NODE_PLATFORM === "windows";

export { parseOpts, formatDuration, isString, has, isYouTubeRegex, isWin };
