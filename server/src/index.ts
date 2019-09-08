import { downloader } from "./downloader";
import { openFolder } from "./openFolder";
import * as path from "path";
import * as express from "express";
import * as cors from "cors";

const port = 1717;
const app = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, '../client') ))

app.post("/download", downloader);

app.post("/openFolder", openFolder);

app.listen(port, () => {
  console.log("Server running on port", port);
});

