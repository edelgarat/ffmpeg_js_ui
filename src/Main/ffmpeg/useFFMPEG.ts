import React from "react";

import FFMPEG, { WatcherCallbackDataInterface } from "./library/ffmpeg";
import useCommand, { CommandInterface } from "./command/useCommand";

import { LocalFileInterface } from "../types";

function calculateFileNamePostfix(
  command: CommandInterface,
  files: LocalFileInterface[],
) {
  return files.find(
    file => file.name === `output.${command.outputFileExtension}`,
  )
    ? `.${Date.now().toString()}`
    : "";
}

export function useFFMPEG(
  logFunction: (msg: string) => void,
  synchronizeFileSystem: (files: { fileName: string; url: string }[]) => void,
) {
  const [ffmpegModuleSource] = React.useState(() =>
    fetch("/static/js/ffmpeg-core.js").then(val => val.text()),
  );

  const commandApi = useCommand();

  const [ffmpeg, setFFMPEG] = React.useState<FFMPEG>(null);

  const logRef = React.useRef("");

  React.useEffect(() => {
    let timer;
    ffmpegModuleSource.then(ffmpegSource => {
      setInterval(() => {
        logFunction(logRef.current);
        logRef.current = "";
      }, 1000);
      const ffmpeg = new FFMPEG(ffmpegSource);
      ffmpeg.on("log", msg => {
        logRef.current += `${msg}\n\n`;
      });
      ffmpeg.on("synchronizeFileSystem", synchronizeFileSystem);
      setFFMPEG(ffmpeg);
    });
    return () => clearInterval(timer);
  }, []);

  return {
    ffmpegLoaded: !!ffmpeg,
    commandApi,
    removeFile: (name: string) => ffmpeg.removeFile(name),
    run: (localFiles: LocalFileInterface[]) =>
      ffmpeg.run(
        commandApi.getArray(
          "/src/",
          calculateFileNamePostfix(commandApi.command, localFiles),
        ),
      ),
    loadFile: (localFile: LocalFileInterface) =>
      ffmpeg.loadFile(localFile.name, localFile.file),
    runFilesWatcher: (
      callback: (files: WatcherCallbackDataInterface) => void,
    ) => ffmpeg.runWatcher(callback),
    synchronizeFileSystem: (fileNames: string[]) =>
      ffmpeg.synchronizeFileSystem(fileNames),
  };
}
