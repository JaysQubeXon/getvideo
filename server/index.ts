import { downloader } from "./downloader";
import { openFolder } from "./openFolder";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 1717;
const app = express();

app.use(cors());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post("/download", downloader);

app.post("/openFolder", openFolder);

app.listen(port, () => {
  console.log("Server running on port", port);
});

