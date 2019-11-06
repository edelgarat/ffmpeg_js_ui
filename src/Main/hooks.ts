import React from "react";
import { append, omit, remove, propEq } from "ramda";

import { useFFMPEG } from "./ffmpeg/useFFMPEG";

import { LocalFileInterface } from "./types";
import { useForceUpdate } from "./helpers";
import FFMPEG from "./ffmpeg/ffmpeg";

export default function() {
  const {
    ffmpegLoaded,
    logs,
    commandApi,
    run: runFFMPEG,
    loadFile,
    runFilesWatcher,
    removeFile: removeFFMPEGFile,
  } = useFFMPEG();

  const update = useForceUpdate();
  const localFiles = React.useRef<LocalFileInterface[]>([]);

  const [selectedFiles, setSelectedFiles] = React.useState<{
    [name: string]: true;
  }>({});

  React.useEffect(() => {
    if (!ffmpegLoaded) return;

    runFilesWatcher(data => {
      Object.keys(data).forEach(fileName => {
        const localFile = localFiles.current.find(propEq("name", fileName));
        if (localFile) {
          if (!localFile.ffmpegContent) {
            localFile.ffmpegContent = data[fileName];
            update();
          }
          return;
        }
        localFiles.current = append(
          { name: fileName, file: null, ffmpegContent: data[fileName] },
          localFiles.current,
        );
        update();
      });
    });
  }, [ffmpegLoaded]);

  const [selectedFilesNotEmpty, setSelectedFilesNotEmpty] = React.useState(
    false,
  );

  React.useEffect(() => {
    const keys = Object.keys(selectedFiles);
    commandApi.setInputs(keys);
    setSelectedFilesNotEmpty(!!keys.length);
  }, [selectedFiles]);

  function toggleSelectFile(file: LocalFileInterface) {
    if (selectedFiles[file.name]) {
      setSelectedFiles(omit([file.name], selectedFiles));
      return;
    }
    setSelectedFiles({ ...selectedFiles, [file.name]: true });
  }

  function uploadFile(file: File) {
    localFiles.current = append(
      { name: file.name, file: file },
      localFiles.current,
    );
    update();
  }

  function downloadFile(file: LocalFileInterface) {
    const a = document.createElement("a");
    a.download = file.name;
    document.body.appendChild(a);
    if (file.ffmpegContent) {
      a.href = URL.createObjectURL(
        FFMPEG.convertUint8ArrayToBlob(file.ffmpegContent),
      );
    } else {
      a.href = URL.createObjectURL(new Blob([file.file]));
    }
    a.click();
    document.body.removeChild(a);
  }

  function removeFile(localFile: LocalFileInterface) {
    if (localFile.ffmpegContent) removeFFMPEGFile(localFile.name);

    localFiles.current = remove(
      localFiles.current.findIndex(propEq("name", localFile.name)),
      1,
      localFiles.current,
    );
    setSelectedFiles(omit([localFile.name], selectedFiles));
  }

  async function run() {
    await Promise.all(
      localFiles.current
        .filter(localFile => selectedFiles[localFile.file.name])
        .filter(localFile => !localFile.ffmpegContent)
        .map(loadFile),
    );
    runFFMPEG();
  }

  return {
    ffmpegLoaded,
    selectedFiles,
    logs,
    commandApi,
    selectedFilesNotEmpty,
    localFiles: localFiles.current,
    run,
    toggleSelectFile,
    uploadFile,
    downloadFile,
    removeFile,
  };
}
