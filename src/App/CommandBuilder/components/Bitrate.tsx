import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import CommandChildComponentWrapper, {
  setCommandArgument,
} from "../CommandChildComponentWrapper";

import { eventValue } from "libs/helpers";

import { CommandControllerInterface } from "libs/ffmpeg/useCommand";

export default React.memo(function({
  commandArguments,
  setArguments,
}: CommandControllerInterface) {
  const { bitrate } = commandArguments.input;
  return (
    <CommandChildComponentWrapper
      node={bitrate}
      label="Bitrate"
      enable={() =>
        setCommandArgument(
          ["input", "bitrate"],
          commandArguments,
          setArguments,
          ["", ""],
        )
      }
      disable={() =>
        setCommandArgument(
          ["input", "bitrate"],
          commandArguments,
          setArguments,
          null,
        )
      }
    >
      {() => (
        <Box width="300px" display="flex">
          <Tooltip title="Video bitrate" placement="bottom-start">
            <TextField
              label="Video"
              placeholder="4m"
              value={bitrate[0]}
              onChange={eventValue(
                setCommandArgument(
                  ["input", "bitrate", 0],
                  commandArguments,
                  setArguments,
                ),
              )}
            />
          </Tooltip>
          <Box width="10px" />
          <Tooltip title="Audio bitrate" placement="bottom-start">
            <TextField
              label="Audio"
              placeholder="128k"
              value={bitrate[1]}
              onChange={eventValue(
                setCommandArgument(
                  ["input", "bitrate", 1],
                  commandArguments,
                  setArguments,
                ),
              )}
            />
          </Tooltip>
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
