import React from "react";
import { assocPath } from "ramda";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";

import CommandChildComponentWrapper from "../CommandChildComponentWrapper";

import { eventValue } from "../../../helpers";

import { CommandControllerInterface } from "../useCommand";

interface CodecsInterface extends CommandControllerInterface {
  label: string;
  type: "videoCodec" | "audioCodec";
  items: { name: string; value: string }[];
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

const videoCodecs: CodecsInterface["items"] = [
  { name: "Copy original", value: "copy" },
  { name: "H.264", value: "h264" },
  { name: "MPEG-4", value: "mpeg4" },
  { name: "H.265", value: "hevc" },
  { name: "Apple ProRes", value: "prores" },
];

const audioCodecs: CodecsInterface["items"] = [
  { name: "Copy original", value: "copy" },
  { name: "Mp3", value: "mp3" },
  { name: "Flac", value: "flac" },
  { name: "AAC", value: "aac" },
];

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
