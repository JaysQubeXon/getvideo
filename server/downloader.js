"use strict";
exports.__esModule = true;
var youtubedl = require('@microlink/youtube-dl');
var SIX_HOUNDRED_MEGABYTES = 1000 * 1000 * 600;
function downloader(_a, res) {
    var _b = _a.body, videoURL = _b.videoURL, folderName = _b.folderName;
    console.log("Starting to download requested video");
    // var video = youtubedl(videoURL,
    //   // Optional arguments passed to youtube-dl.
    //   ['-f', '18']
    // );
    if (folderName.length < 0) {
        res.json({ data: { success: false } });
        console.log("Please provide a folder for download!");
        return;
    }
    console.log("Your Download will be placed in \n", folderName);
    youtubedl.exec(videoURL, ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]'], {
        cwd: folderName,
        // encoding: "buffer",
        maxBuffer: SIX_HOUNDRED_MEGABYTES
    }, function execYTDL(err, output) {
        'use strict';
        if (err) {
            throw err;
        }
        console.log(output.join('\n'));
        res.json({ data: { success: true } });
    });
    // video.on('info', function (info: any) {
    //   let filename = name.length > 0 ? name : info._filename;
    //   video.pipe(fs.createWriteStream(`/Users/noamgabrieljacobson/Downloads/${filename}.mp4`));
    //   res.json({ success: true });
    // });
}
exports.downloader = downloader;
