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
      node={commandArguments.input.extractPartition}
      label="Extract partition"
      enable={() =>
        setArguments(
          assocPath(["input", "extractPartition"], ["", ""], commandArguments),
        )
      }
      disable={() =>
        setArguments(
          assocPath(
            ["input", "extractPartition"],
            null as any,
            commandArguments,
          ),
        )
      }
    >
      {() => (
        <Box width="350px" display="flex">
          <Tooltip title="Start trimming video from" placement="bottom-start">
            <TextField
              label="Start"
              placeholder="00:00:00"
              value={commandArguments.input.extractPartition[0]}
              onChange={eventValue(value =>
                setArguments(
                  assocPath(
                    ["input", "extractPartition", 0],
                    value,
                    commandArguments,
                  ),
                ),
              )}
            />
          </Tooltip>
          <Box width="10px" />
          <Tooltip title="Video trimming length" placement="bottom-start">
            <TextField
              label="Length"
              value={commandArguments.input.extractPartition[1]}
              placeholder="00:00:00"
              onChange={eventValue(value =>
                setArguments(
                  assocPath(
                    ["input", "extractPartition", 1],
                    value,
                    commandArguments,
                  ),
                ),
              )}
            />
          </Tooltip>
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
