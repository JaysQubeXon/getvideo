"use strict";
exports.__esModule = true;
var fs = require("fs");
var youtubedl = require("@microlink/youtube-dl");
var SIX_HOUNDRED_MEGABYTES = 1000 * 1000 * 600;
var deleteFIle = function (path) {
    console.log("starting to delete:", path);
    fs.unlink(path, function (err) {
        if (err)
            throw err;
        console.log("successfully deleted!");
    });
};
var renameFile = function (oldPath, newPath) {
    console.log("starting to rename:", oldPath);
    console.log("Rename to:", newPath);
    try {
        fs.renameSync("~" + oldPath, "~" + newPath);
    }
    catch (err) {
        console.log(err);
    }
};
function downloader(req, res) {
    var _a = req.body, videoURL = _a.videoURL, folderName = _a.folderName, _b = _a.options, downloadType = _b.downloadType, renameFileName = _b.renameFileName;
    var type = "";
    if (downloadType === "both")
        type = "bestvideo[ext=mp4]+bestaudio[ext=m4a]";
    if (downloadType === "audio-only")
        type = "bestaudio[ext=m4a]";
    if (downloadType === "video-only")
        type = "bestvideo[ext=mp4]";
    console.log("Download Type:", type);
    console.log("Starting to download requested video");
    if (folderName.length < 0) {
        res.json({ data: { success: false } });
        console.log("Please provide a folder for download!");
        return;
    }
    var option = {
        cwd: folderName,
        // encoding: "buffer",
        maxBuffer: SIX_HOUNDRED_MEGABYTES
    };
    console.log("Your Download will be placed in \n", folderName);
    var ytFn = function execYTDL(err, output) {
        "use strict";
        if (err) {
            throw err;
        }
        console.log(output.join("\n"));
        if (output.length > 0) {
            if (renameFileName && renameFileName.length > 0) {
                console.log("Selected rename for file:", renameFileName);
                var name_1 = "";
                for (var i = 0; i < output.length; i++) {
                    if (/has already been downloaded/.test(output[i])) {
                        break;
                    }
                    var filename = /mp4|m4a/.test(output[i]);
                    if (filename) {
                        var part = output[i].split(": ");
                        // part[0] = `[download] Destination: `
                        // part[1] = filename
                        var noExt = part[1].split(".")[0];
                        console.log("what is noExt:", noExt);
                        // file extention removed and only name added.
                        name_1 = noExt;
                        break;
                    }
                    else {
                        continue;
                    }
                }
                var o_1 = folderName + ("/" + name_1);
                var n_1 = folderName + ("/" + renameFileName);
                console.log("\nwhat is old filename:", o_1);
                console.log("what is new filename:", n_1);
                console.log("\n");
                var t = 1000 * 10;
                if (downloadType === "both") {
                    console.log(downloadType);
                    setTimeout(function () {
                        renameFile(o_1 + ".mp4", n_1 + ".mp4");
                        renameFile(o_1 + ".m4a", n_1 + ".m4a");
                    }, t);
                }
                if (downloadType === "video-only") {
                    console.log(downloadType);
                    setTimeout(function () { return renameFile(o_1 + ".mp4", n_1 + ".mp4"); }, t);
                }
                if (downloadType === "audio-only") {
                    console.log(downloadType);
                    setTimeout(function () { return renameFile(o_1 + ".m4a", n_1 + ".m4a"); }, t);
                }
            }
            res.json({ data: { success: true } });
            console.log("\n");
        }
    };
    youtubedl.exec(videoURL, ["-f", type], option, ytFn);
}
exports.downloader = downloader;
