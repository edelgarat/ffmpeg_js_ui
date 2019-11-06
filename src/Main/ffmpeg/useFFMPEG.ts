import React from "react";

import FFMPEG, { WatcherCallbackDataInterface } from "./ffmpeg";
import useCommand from "./useCommand";
import { useForceUpdate } from "../helpers";

import { LocalFileInterface } from "../types";

export function useFFMPEG() {
  const [ffmpegSourceModule] = React.useState(() =>
    import("../../ffmpeg_build/ffmpeg"),
  );

  const commandApi = useCommand();

  const [ffmpeg, setFFMPEG] = React.useState<FFMPEG>(null);

  const forceUpdate = useForceUpdate();

  const logs = React.useRef("");

  React.useEffect(() => {
    ffmpegSourceModule.then(ffmpegSource => {
      const ffmpeg = new FFMPEG(ffmpegSource.default);
      ffmpeg.on("error", msg => {
        console.log("error", msg);
        logs.current = `${logs.current}\nERROR: ${msg}`;
        forceUpdate();
      });
      ffmpeg.on("log", msg => {
        console.log(msg);
        logs.current = `${logs.current}\n${msg}`;
        forceUpdate();
      });
      setFFMPEG(ffmpeg);
    });
  }, []);

  return {
    ffmpegLoaded: !!ffmpeg,
    logs: logs.current,
    commandApi,
    removeFile: (name: string) => ffmpeg.removeFile(name),
    run: () => ffmpeg.run(commandApi.getArray("/src/")),
    loadFile: (localFile: LocalFileInterface) =>
      ffmpeg.loadFile(localFile.name, localFile.file),
    runFilesWatcher: (
      callback: (files: WatcherCallbackDataInterface) => void,
    ) => ffmpeg.runWatcher(callback),
  };
}
