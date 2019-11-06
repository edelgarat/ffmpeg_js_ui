import React from "react";
import styled from "styled-components/macro";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Template from "./Template";
import FileLoaderSystemDialog from "./FileLoader/SystemDialog";

import FileLoaderBox from "./FileLoader/FileLoaderBox";

import FileTree from "./FileTree";

import mainHook from "./hooks";

const StyledCode = styled.code`
  white-space: pre-wrap;
  overflow: scroll;
  max-height: 200px;
  background-color: white;
  padding: 12px;
`;

export default React.memo(function() {
  const {
    ffmpegLoaded,
    selectedFiles,
    commandApi,
    logs,
    selectedFilesNotEmpty,
    localFiles,
    toggleSelectFile,
    uploadFile,
    downloadFile,
    removeFile,
    run,
  } = mainHook();

  return (
    <Template
      rightElement={
        <Box display="flex" alignItems="center">
          {selectedFilesNotEmpty && (
            <Button
              variant="contained"
              color="default"
              size="large"
              onClick={run}
            >
              run
            </Button>
          )}
        </Box>
      }
    >
      {localFiles.length === 0 ? (
        <Box
          display="flex"
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          {ffmpegLoaded ? (
            <FileLoaderSystemDialog onFileLoaded={uploadFile}>
              {open => (
                <FileLoaderBox padding="100px 180px" onClick={open}>
                  <Typography>Click here to select file</Typography>
                </FileLoaderBox>
              )}
            </FileLoaderSystemDialog>
          ) : (
            <>
              <CircularProgress />
              <Typography>Loading FFMPEG library...</Typography>
            </>
          )}
        </Box>
      ) : (
        <Box display="flex" flex={1} height="calc(100vh - 64px)">
          <Box
            height="100%"
            width="20%"
            padding="18px"
            borderRight="1px solid lightgray"
            display="flex"
            flexDirection="column"
          >
            <FileTree
              files={localFiles}
              selectedFileNames={selectedFiles}
              newFileLoader={
                <FileLoaderSystemDialog onFileLoaded={uploadFile}>
                  {open => (
                    <FileLoaderBox padding="10px 100px" onClick={open}>
                      <Typography>Upload file</Typography>
                    </FileLoaderBox>
                  )}
                </FileLoaderSystemDialog>
              }
              downloadFile={downloadFile}
              removeFile={removeFile}
              toggleFileSelected={toggleSelectFile}
            />
          </Box>
          <Box
            height="100%"
            width="80%"
            padding="18px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box bgcolor="lightgray" padding="18px">
              <code>{commandApi.getString()}</code>
            </Box>
            <Box flex={1} padding="18px">
              123
            </Box>
            <StyledCode dangerouslySetInnerHTML={{ __html: logs }} />
          </Box>
        </Box>
      )}
    </Template>
  );
});
