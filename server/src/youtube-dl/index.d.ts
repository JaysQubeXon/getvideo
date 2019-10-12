/// <reference types="node" />

import { ExecFileOptions } from "child_process";

declare namespace YoutubeDownload {
  interface YTDL {
    setYtdlBinary?: (path: string) => void;
    getYtdlBinary?: () => string;
    exec?: (
      url: string,
      args: string[],
      options: ExecFileOptions,
      cb: VersionCallback
    ) => void;
    getInfo?: (
      url: string,
      args: string[],
      options: any,
      cb: DataCallback
    ) => any;
    getSubs: (url: string, options: GetSubsOptions, db: DataCallback) => void;
    getThumbs: (
      url: string,
      options: GetThumbsOptions,
      cd: DataCallback
    ) => void;
    getExtractors: (
      descriptions: boolean,
      options: ExecFileOptions,
      cd: DataCallback
    ) => void;
    on?(event: "data"): any;
    on?(event: "complete"): any;
    on?(event: "info"): any;
    on?(event: "next"): any;
    on?(event: "error"): any;
  }

  type VersionCallback = (err: Error | null, newVersion?: string) => void;
  type DataCallback = (err: Error | null, data?: any) => void;
  type YTDLArgs = string | string[];

  interface ProcessDataOptions {
    http_headrers?: any;
    cwd?: string;
    start: number;
    end: number;
  }

  interface GetSubsOptions {
    auto?: boolean;
    all?: boolean;
    lang?: string;
    format?: string;
    cwd?: string;
    warrning?: any;
  }

  interface GetThumbsOptions {
    all?: boolean;
    cwd?: string;
    warrning?: any;
  }

  interface Info {
    _duration_raw?: string | number;
    _duration_hms?: string | number;
    duration?: string | number;
    url: string;
  }
}

export = YoutubeDownload;