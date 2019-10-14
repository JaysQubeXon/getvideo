import { downloader } from "./downloader";
import { openFolder } from "./openFolder";
import * as path from "path";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser"; 

const port = 1717;
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/download", downloader);

app.post("/openFolder", openFolder);

app.use(express.static(path.resolve(__dirname, "../client")));

app.listen(port, () => {
  // const downloader = new Downloader();
  // downloader.downloader(function error(err, done) {
  //   if (err) return console.log(err.stack)
  //   console.log(done)
  // });
  console.log("Server running on port", port);
});
