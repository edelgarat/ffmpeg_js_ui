import React from "react";
import { assocPath } from "ramda";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";

import CommandChildComponentWrapper from "./CommandChildComponentWrapper";

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
          <Input
            value={commandArguments.output.resize[0]}
            placeholder="width(px)"
            onChange={eventValue(value =>
              setArguments(
                assocPath(["output", "resize", 0], value, commandArguments),
              ),
            )}
          />
          <Input
            value={commandArguments.output.resize[1]}
            placeholder="height(px)"
            onChange={eventValue(value =>
              setArguments(
                assocPath(["output", "resize", 1], value, commandArguments),
              ),
            )}
          />
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
