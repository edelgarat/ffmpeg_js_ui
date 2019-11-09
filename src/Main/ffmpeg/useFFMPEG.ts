import React from "react";

import FFMPEG, { WatcherCallbackDataInterface } from "./library/ffmpeg";
import useCommand from "./command/useCommand";

import { LocalFileInterface } from "../types";

export function useFFMPEG(
  log: (msg: string) => void,
  synchronizeFileSystem: (files: { fileName: string; url: string }[]) => void,
) {
  const [ffmpegModuleSource] = React.useState(() =>
    fetch("/static/js/ffmpeg.js").then(val => val.text()),
  );

  const commandApi = useCommand();

  const [ffmpeg, setFFMPEG] = React.useState<FFMPEG>(null);

  React.useEffect(() => {
    ffmpegModuleSource.then(ffmpegSource => {
      const ffmpeg = new FFMPEG(ffmpegSource);
      ffmpeg.on("log", log);
      ffmpeg.on("synchronizeFileSystem", synchronizeFileSystem);
      setFFMPEG(ffmpeg);
    });
  }, []);

  return {
    ffmpegLoaded: !!ffmpeg,
    commandApi,
    removeFile: (name: string) => ffmpeg.removeFile(name),
    run: () => ffmpeg.run(commandApi.getArray("/src/")),
    loadFile: (localFile: LocalFileInterface) =>
      ffmpeg.loadFile(localFile.name, localFile.file),
    runFilesWatcher: (
      callback: (files: WatcherCallbackDataInterface) => void,
    ) => ffmpeg.runWatcher(callback),
    synchronizeFileSystem: (fileNames: string[]) =>
      ffmpeg.synchronizeFileSystem(fileNames),
  };
}
