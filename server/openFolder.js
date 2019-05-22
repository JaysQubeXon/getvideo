"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function openFolder(req, res) {
    console.log("opening folder...");
    child_process_1.exec("open /Users/noamgabrieljacobson/Downloads");
    // exec("open /<URI TO Download Folder>");
}
exports.openFolder = openFolder;
