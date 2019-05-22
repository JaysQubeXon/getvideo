"use strict";
exports.__esModule = true;
var downloader_1 = require("./downloader");
var openFolder_1 = require("./openFolder");
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var port = 1717;
var app = express();
app.use(cors());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.post("/download", downloader_1.downloader);
app.post("/openFolder", openFolder_1.openFolder);
app.listen(port, function () {
    console.log("Server running on port", port);
});
