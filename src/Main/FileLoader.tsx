import React from "react";

export enum FileAccept {
  VIDEO = "video/*",
}

interface FileInterface {
  accept?: FileAccept;
  maxSize?: number;
  onFileLoaded: (file: File) => void;
  children: (openDialog: () => void) => JSX.Element;
}

const FileLoader = ({
  maxSize,
  accept,
  children,
  onFileLoaded,
}: FileInterface) => {
  const file = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    file.current = document.createElement("input");
    const input = file.current;
    input.accept = accept;
    input.type = "file";
    input.onchange = event => {
      const selectedFile = (event.target as HTMLInputElement).files[0];
      if (!selectedFile) return;
      input.value = "";
      if (maxSize && selectedFile.size > maxSize) return;
      onFileLoaded(selectedFile);
    };
    document.body.appendChild(file.current);
    return () => document.body.removeChild(file.current);
  }, [onFileLoaded]);

  return children(() => file.current && file.current.click());
};

FileLoader.defaultProps = {
  accept: FileAccept.VIDEO,
};

export default React.memo(FileLoader);
