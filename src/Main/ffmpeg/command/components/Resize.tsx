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
      node={commandArguments.output.resize}
      label="Resize"
      enable={() =>
        setArguments(
          assocPath(["output", "resize"], ["", ""], commandArguments),
        )
      }
      disable={() =>
        setArguments(
          assocPath(["output", "resize"], null as any, commandArguments),
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
              value={commandArguments.output.resize[0]}
              placeholder="1920"
              onChange={eventValue(value =>
                setArguments(
                  assocPath(["output", "resize", 0], value, commandArguments),
                ),
              )}
            />
          </Tooltip>
          <Tooltip
            title="vertical pixel size of the video"
            placement="bottom-start"
          >
            <TextField
              label="Height"
              value={commandArguments.output.resize[1]}
              placeholder="1080"
              onChange={eventValue(value =>
                setArguments(
                  assocPath(["output", "resize", 1], value, commandArguments),
                ),
              )}
            />
          </Tooltip>
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
