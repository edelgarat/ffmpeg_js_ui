import React from "react";
import { assocPath } from "ramda";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";

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
          <Input
            value={commandArguments.input.extractPartition[0]}
            placeholder="starts from (00:00:14)"
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
          <Input
            value={commandArguments.input.extractPartition[1]}
            placeholder="length (00:00:11)"
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
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});
