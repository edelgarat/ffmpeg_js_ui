import React from "react";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";

import FileMenuItem from "./FileMenuItem";
import {LocalFileInterface} from "../types";

interface FileTreeInterface {
  files: LocalFileInterface[];
  selectedFileNames: { [name: string]: true };
  newFileLoader: JSX.Element;
  toggleFileSelected: (file: LocalFileInterface) => void;
  downloadFile: (file: LocalFileInterface) => void;
  removeFile: (file: LocalFileInterface) => void;
}

export default React.memo(function({
  files,
  selectedFileNames,
  newFileLoader,
  toggleFileSelected,
  downloadFile,
  removeFile,
}: FileTreeInterface) {
  return (
    <>
      <Box flex={1} overflow="scroll">
        <List>
          <FileMenuItem
            files={files}
            selectedFileNames={selectedFileNames}
            toggleFileSelected={toggleFileSelected}
            removeFile={removeFile}
            downloadFile={downloadFile}
          />
        </List>
      </Box>
      {newFileLoader}
    </>
  );
});
