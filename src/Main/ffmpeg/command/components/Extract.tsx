import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";

import CommandChildComponentWrapper, {
  setCommandArgument,
} from "../CommandChildComponentWrapper";

import { eventValue } from "../../../helpers";

import { CommandControllerInterface } from "../useCommand";

export default React.memo(function({
  commandArguments,
  setArguments,
}: CommandControllerInterface) {
  const { extractPartition } = commandArguments.input;
  return (
    <CommandChildComponentWrapper
      node={extractPartition}
      label="Extract partition"
      enable={() =>
        setCommandArgument(
          ["input", "extractPartition"],
          commandArguments,
          setArguments,
          ["", ""],
        )
      }
      disable={() =>
        setCommandArgument(
          ["input", "extractPartition"],
          commandArguments,
          setArguments,
          null,
        )
      }
    >
      {() => (
        <Box width="350px" display="flex">
          <Tooltip title="Start trimming video from" placement="bottom-start">
            <TextField
              label="Start"
              placeholder="00:00:00"
              value={extractPartition[0]}
              onChange={eventValue(
                setCommandArgument(
                  ["input", "extractPartition", 0],
                  commandArguments,
                  setArguments,
                ),
              )}
            />
          </Tooltip>
          <Box width="10px" />
          <Tooltip title="Video trimming length" placement="bottom-start">
            <TextField
              label="Length"
              value={extractPartition[1]}
              placeholder="00:00:00"
              onChange={eventValue(
                setCommandArgument(
                  ["input", "extractPartition", 1],
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
