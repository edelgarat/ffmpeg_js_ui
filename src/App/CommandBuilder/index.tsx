import React from "react";
import Box from "@material-ui/core/Box";

import Resize from "./components/Resize";
import Extract from "./components/Extract";
import Bitrate from "./components/Bitrate";
import { AudioCodec, VideoCodec } from "./components/Codecs";

import { CommandControllerInterface } from "libs/ffmpeg/useCommand";

export default React.memo(function(props: CommandControllerInterface) {
  return (
    <Box display="flex" flexWrap="wrap">
      <Resize {...props} />
      <Extract {...props} />
      <Bitrate {...props} />
      <VideoCodec {...props} />
      <AudioCodec {...props} />
    </Box>
  );
});
