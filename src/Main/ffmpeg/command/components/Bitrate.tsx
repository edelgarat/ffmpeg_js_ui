import React from "react";
import { assocPath } from "ramda";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import CommandChildComponentWrapper from "../CommandChildComponentWrapper";

import { eventValue } from "../../../helpers";

import { CommandControllerInterface } from "../useCommand";

export default React.memo(function({
  commandArguments,
  setArguments,
}: CommandControllerInterface) {
  return (
    <CommandChildComponentWrapper
      node={commandArguments.input.bitrate}
      label="Bitrate"
      enable={() =>
        setArguments(
          assocPath(["input", "bitrate"], ["", ""], commandArguments),
        )
      }
      disable={() =>
        setArguments(
          assocPath(["input", "bitrate"], null as any, commandArguments),
        )
      }
    >
      {() => (
        <Box width="300px" display="flex">
          <Tooltip title="Video bitrate" placement="bottom-start">
            <TextField
              label="Video"
              placeholder="4m"
              value={commandArguments.input.bitrate[0]}
              onChange={eventValue(value =>
                setArguments(
                  assocPath(["input", "bitrate", 0], value, commandArguments),
                ),
              )}
            />
          </Tooltip>
          <Box width="10px" />
          <Tooltip title="Audio bitrate" placement="bottom-start">
            <TextField
              label="Audio"
              placeholder="128k"
              value={commandArguments.input.bitrate[1]}
              onChange={eventValue(value =>
                setArguments(
                  assocPath(["input", "bitrate", 1], value, commandArguments),
                ),
              )}
            />
          </Tooltip>
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
