import { exec } from "child_process";
import {Request} from "express";

export function openFolder(req: Request, res: any) {
  console.log("opening folder...");
  exec("open "+ req.body.folderName);
}
