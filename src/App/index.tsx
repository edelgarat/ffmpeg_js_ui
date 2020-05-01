import React from "react";
import { propEq } from "ramda";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

import Layout from "./Layout";
import FileSelectorSystemDialog from "./FileLoader/FileSelectorSystemDialog";
import FileLoaderBox from "./FileLoader/FileLoaderBox";
import FileTree from "./FileTree";
import EmptyFiles from "./EmptyFiles";
import LoggerView from "./LoggerView";
import CommandBuilder from "./CommandBuilder";

import mainHook from "./mainHook";

import { eventValue } from "libs/helpers";
import { CodecItem, videoCodecs } from "dictionaries/codecs";

const defaultOutputFileExtensions = ["mp4", "avi", "mpg", "mkv", "jpg"];

function getCodecFileExtension(selectedVideoCodec: CodecItem) {
  if (!selectedVideoCodec) return defaultOutputFileExtensions;

  const { supportedOutputs } = selectedVideoCodec;
  if (supportedOutputs) return supportedOutputs;

  return defaultOutputFileExtensions;
}

export default React.memo(function() {
  const logRef = React.useRef<HTMLElement>(null);
  const {
    ffmpegLoaded,
    selectedFiles,
    commandApi,
    selectedFilesNotEmpty,
    localFiles,
    toggleSelectFile,
    uploadFile,
    downloadFile,
    removeFile,
    run,
  } = mainHook(logRef);

  const videoCodec = commandApi.command.arguments.videoCodec;

  const selectedVideoCodec = React.useMemo(
    () => videoCodecs.find(propEq("value", videoCodec)),
    [videoCodec],
  );

  React.useEffect(() => {
    if (selectedVideoCodec && selectedVideoCodec.supportedOutputs)
      commandApi.setOutputExtension(selectedVideoCodec.supportedOutputs[0]);
  }, [selectedVideoCodec]);

  return (
    <Layout
      headerAction={
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
        <EmptyFiles loading={!ffmpegLoaded} uploadFile={uploadFile} />
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
                <FileSelectorSystemDialog onFileLoaded={uploadFile}>
                  {open => (
                    <FileLoaderBox padding="10px 100px" onClick={open}>
                      <Typography>Upload file</Typography>
                    </FileLoaderBox>
                  )}
                </FileSelectorSystemDialog>
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
            <Box padding="18px" display="flex">
              <Box
                bgcolor="lightgray"
                marginRight="18px"
                flex={1}
                display="flex"
                alignItems="center"
                padding="0 18px"
              >
                <code>{commandApi.getString()}</code>
              </Box>
              <Box width="100px" marginBottom="2px">
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={commandApi.command.outputFileExtension}
                    onChange={eventValue(commandApi.setOutputExtension)}
                  >
                    {getCodecFileExtension(selectedVideoCodec).map(name => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box padding="18px">
              <CommandBuilder
                commandArguments={commandApi.command.arguments}
                setArguments={commandApi.setArguments}
              />
            </Box>
            <LoggerView logRef={logRef} />
          </Box>
        </Box>
      )}
    </Layout>
  );
});
