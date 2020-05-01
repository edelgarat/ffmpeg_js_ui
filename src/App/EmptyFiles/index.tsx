import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import FileSelectorSystemDialog from "../FileLoader/FileSelectorSystemDialog";
import FileLoaderBox from "../FileLoader/FileLoaderBox";

interface EmptyFilesInterface {
  loading: boolean;
  uploadFile: (file: File) => void;
}

export default React.memo(function({
  loading,
  uploadFile,
}: EmptyFilesInterface) {
  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center">
      {loading ? (
        <>
          <CircularProgress />
          <Typography>Loading FFMPEG library...</Typography>
        </>
      ) : (
        <FileSelectorSystemDialog onFileLoaded={uploadFile}>
          {open => (
            <FileLoaderBox padding="100px 180px" onClick={open}>
              <Typography>Click here to select file</Typography>
            </FileLoaderBox>
          )}
        </FileSelectorSystemDialog>
      )}
    </Box>
  );
});
