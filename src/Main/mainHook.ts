import React, { MutableRefObject } from "react";
import { append, omit, remove, propEq, prop } from "ramda";

import { useFFMPEG } from "./ffmpeg/useFFMPEG";
import { useForceUpdate } from "./helpers";

import { LocalFileInterface } from "./types";

export default function(ref: MutableRefObject<HTMLElement>) {
  const update = useForceUpdate();
  const localFiles = React.useRef<LocalFileInterface[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<{
    [name: string]: true;
  }>({});

  const {
    ffmpegLoaded,
    commandApi,
    run: runFFMPEG,
    loadFile,
    runFilesWatcher,
    removeFile: removeFFMPEGFile,
    synchronizeFileSystem,
  } = useFFMPEG(
    msg => {
      if (ref.current) {
        ref.current.innerHTML += msg;
        return;
      }
      console.log(msg);
    },
    files => {
      files.forEach(({ fileName, url }) => {
        const file = localFiles.current.find(propEq("name", fileName));
        if (!file) return;
        file.objectURL = url;
      });
      update();
    },
  );

  React.useEffect(() => {
    if (!ffmpegLoaded) return;
    runFilesWatcher(data => {
      let newFileDetected = false;
      Object.keys(data).forEach(fileName => {
        const localFile = localFiles.current.find(propEq("name", fileName));
        if (localFile) return;
        localFiles.current = append(
          { name: fileName, file: null, objectURL: null },
          localFiles.current,
        );
        newFileDetected = true;
      });
      if (newFileDetected) {
        synchronizeFileSystem(localFiles.current.map(prop("name")));
      }
      update();
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

  async function uploadFile(file: File) {
    localFiles.current = append(
      { name: file.name, file: file },
      localFiles.current,
    );
    await Promise.all(localFiles.current.map(loadFile));
    update();
  }

  function downloadFile(file: LocalFileInterface) {
    const a = document.createElement("a");
    a.download = file.name;
    document.body.appendChild(a);
    if (file.objectURL) {
      a.href = file.objectURL;
    } else {
      a.href = URL.createObjectURL(new Blob([file.file]));
    }
    a.click();
    document.body.removeChild(a);
  }

  function removeFile(localFile: LocalFileInterface) {
    removeFFMPEGFile(localFile.name);
    localFiles.current = remove(
      localFiles.current.findIndex(propEq("name", localFile.name)),
      1,
      localFiles.current,
    );
    setSelectedFiles(omit([localFile.name], selectedFiles));
  }

  return {
    ffmpegLoaded,
    selectedFiles,
    commandApi,
    selectedFilesNotEmpty,
    localFiles: localFiles.current,
    run: () => runFFMPEG(localFiles.current),
    toggleSelectFile,
    uploadFile,
    downloadFile,
    removeFile,
  };
}
