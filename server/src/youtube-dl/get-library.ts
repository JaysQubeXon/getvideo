import * as fs from "fs";
import * as path from "path";

const { readFileSync, existsSync } = fs;

const binPath = path.join(__dirname, "..", "bin");
const detailsPath = path.join(binPath, "details");

module.exports = () => {
  if (!existsSync(detailsPath)) {
    throw new Error("ERROR: unable to locate `youtube-dl` at " + binPath);
  }

  const details = JSON.parse(String(readFileSync(detailsPath.toString())));

  return details.path
    ? details.path
    : path.resolve(__dirname, "..", "bin", details.exec);
};
