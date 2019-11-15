import React from "react";
import { assocPath } from "ramda";
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
  const { resize } = commandArguments.output;
  return (
    <CommandChildComponentWrapper
      node={resize}
      label="Resize"
      enable={() =>
        setCommandArgument(
          ["output", "resize"],
          commandArguments,
          setArguments,
          ["", ""],
        )
      }
      disable={() =>
        setCommandArgument(
          ["output", "resize"],
          commandArguments,
          setArguments,
          null,
        )
      }
    >
      {() => (
        <Box width="200px" display="flex">
          <Tooltip
            title="horizontal pixel size of the video"
            placement="bottom-start"
          >
            <TextField
              label="Width"
              value={resize[0]}
              placeholder="1920"
              onChange={eventValue(
                setCommandArgument(
                  ["output", "resize", 0],
                  commandArguments,
                  setArguments,
                ),
              )}
            />
          </Tooltip>
          <Box width="10px" />
          <Tooltip
            title="vertical pixel size of the video"
            placement="bottom-start"
          >
            <TextField
              label="Height"
              value={resize[1]}
              placeholder="1080"
              onChange={eventValue(
                setCommandArgument(
                  ["output", "resize", 1],
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
