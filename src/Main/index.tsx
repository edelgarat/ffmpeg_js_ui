import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";

import FileLoader from "./FileLoader";
import FFMPEG from "./Ffmpeg";

const StyledBox = styled(Box)`
  cursor: pointer;
  border: 2px dashed gray;
  padding: 80px 180px;
`;

function useFFMPEGLoader(onLoad: (ffmpeg: any) => void) {
  const [ffmpegSourceModule] = React.useState(() =>
    import("../ffmpeg_build/ffmpeg"),
  );

  React.useEffect(() => {
    ffmpegSourceModule.then(ffmpegSource => {
      onLoad(ffmpegSource.default());
    });
  }, []);
}

function run(ffmpeg: FFMPEG, file: File) {
  if (!ffmpeg || !file) return;
  ffmpeg.loadFile(file, "avi").then(console.log, console.error);
}

function useFFMPEG() {
  const [ffmpeg, setFFMPEG] = React.useState<FFMPEG>(null);
  const [file, setFile] = React.useState<File>(null);

  useFFMPEGLoader(rawFFMPEG => {
    const ffmpeg = new FFMPEG(rawFFMPEG);
    setFFMPEG(ffmpeg);
    run(ffmpeg, file);
  });

  function loadFile(file: File) {
    setFile(file);
    run(ffmpeg, file);
  }

  return {
    loaded: !!ffmpeg,
    loadFile,
  };
}

export default React.memo(function() {
  const { loaded, loadFile } = useFFMPEG();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <FileLoader onFileLoaded={loadFile}>
        {open => <StyledBox onClick={open}>Click here</StyledBox>}
      </FileLoader>
      {!loaded && (
        <Box marginTop="20px">
          <Typography>Loading ffmpeg...</Typography>
        </Box>
      )}
    </Box>
  );
});
