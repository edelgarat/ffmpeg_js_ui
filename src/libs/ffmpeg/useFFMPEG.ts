import React from "react";

import FFMPEG, { WatcherCallbackDataInterface } from "./library/ffmpeg";
import useCommand, { CommandInterface } from "./useCommand";

import { LocalFileInterface } from "types";

function generateFileNamePostfix(
  command: CommandInterface,
  files: LocalFileInterface[],
) {
  const foundOutputFile = files.find(
    file => file.name === `output.${command.outputFileExtension}`,
  );
  if (!foundOutputFile) return "";
  return `.${Date.now().toString()}`;
}

export function useFFMPEG(
  logFunction: (msg: string) => void,
  synchronizeFileSystem: (files: { fileName: string; url: string }[]) => void,
) {
  const [ffmpegModuleSource] = React.useState(async () => {
    const url = `${process.env.PUBLIC_URL || ""}/static/js/ffmpeg-core.js`;
    const core = await fetch(url);
    return core.text();
  });

  const commandApi = useCommand();

  const [ffmpeg, setFFMPEG] = React.useState<FFMPEG>(null);

  const logTextRef = React.useRef("");

  async function createFFMPEGModule(loggerTimerGetter: (timer) => void) {
    const ffmpegSource = await ffmpegModuleSource;

    const timer = setInterval(() => {
      logFunction(logTextRef.current);
      logTextRef.current = "";
    }, 1000);
    loggerTimerGetter(timer);

    const ffmpeg = new FFMPEG(ffmpegSource);
    ffmpeg.on("log", msg => {
      logTextRef.current += `${msg}\n\n`;
    });
    ffmpeg.on("synchronizeFileSystem", synchronizeFileSystem);

    setFFMPEG(ffmpeg);
  }

  React.useEffect(() => {
    let loggerUpdateInterval;
    createFFMPEGModule(timer => (loggerUpdateInterval = timer));
    return () => clearInterval(loggerUpdateInterval);
  }, []);

  return {
    ffmpegLoaded: !!ffmpeg,
    commandApi,
    removeFile: (name: string) => ffmpeg.removeFile(name),
    run: (localFiles: LocalFileInterface[]) => {
      const fileNamePostfix = generateFileNamePostfix(
        commandApi.command,
        localFiles,
      );
      const commandArray = commandApi.getArray("/src/", fileNamePostfix);
      ffmpeg.run(commandArray);
    },
    loadFile: (localFile: LocalFileInterface) =>
      ffmpeg.loadFile(localFile.name, localFile.file),
    runFilesWatcher: (
      callback: (files: WatcherCallbackDataInterface) => void,
    ) => ffmpeg.runWatcher(callback),
    synchronizeFileSystem: (fileNames: string[]) =>
      ffmpeg.synchronizeFileSystem(fileNames),
  };
}
