import React from "react";
import { assocPath } from "ramda";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";

import CommandChildComponentWrapper from "../CommandChildComponentWrapper";

import { eventValue } from "../../../helpers";

import {
  CodecItem,
  audioCodecs,
  videoCodecs,
} from "../../../dictionaries/codecs";

import { CommandControllerInterface } from "../useCommand";

interface CodecsInterface extends CommandControllerInterface {
  label: string;
  type: "videoCodec" | "audioCodec";
  items: CodecItem[];
}

const BaseCodec = React.memo(function({
  commandArguments,
  type,
  label,
  items,
  setArguments,
}: CodecsInterface) {
  return (
    <CommandChildComponentWrapper
      node={commandArguments.input[type]}
      label={label}
      enable={() =>
        setArguments(assocPath(["input", type], "copy", commandArguments))
      }
      disable={() =>
        setArguments(assocPath(["input", type], null as any, commandArguments))
      }
    >
      {() => (
        <Box width="140px" display="flex">
          <FormControl variant="outlined" fullWidth>
            <Select
              value={commandArguments.input[type]}
              onChange={eventValue(value =>
                setArguments(
                  assocPath(["input", type], value, commandArguments),
                ),
              )}
            >
              {items.map(({ name, value }) => (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </CommandChildComponentWrapper>
  );
});

export const VideoCodec = (props: CommandControllerInterface) => (
  <BaseCodec
    {...props}
    label="Video Codec"
    type="videoCodec"
    items={videoCodecs}
  />
);

export const AudioCodec = (props: CommandControllerInterface) => (
  <BaseCodec
    {...props}
    label="Audio Codec"
    type="audioCodec"
    items={audioCodecs}
  />
);
