import React from "react";

export enum FileAccept {
  VIDEO = "video/*",
}

interface SystemDialogInterface {
  accept?: FileAccept;
  maxSize?: number;
  onFileLoaded: (file: File) => void;
  children: (openDialog: () => void) => JSX.Element;
}

function SystemDialog({
  maxSize,
  accept,
  children,
  onFileLoaded,
}: SystemDialogInterface) {
  const file = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    file.current = document.createElement("input");
    const input = file.current;
    input.style.display = "none";
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
}

SystemDialog.defaultProps = {
  accept: FileAccept.VIDEO,
};

export default React.memo(SystemDialog);
