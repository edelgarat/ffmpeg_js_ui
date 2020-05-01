import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";

import CommandChildComponentWrapper, {
  setCommandArgument,
} from "../CommandChildComponentWrapper";

import { eventValue } from "libs/helpers";
import { CodecItem, audioCodecs, videoCodecs } from "dictionaries/codecs";

import { CommandControllerInterface } from "libs/ffmpeg/useCommand";

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
  const setType = setCommandArgument([type], commandArguments, setArguments);

  return (
    <CommandChildComponentWrapper
      node={commandArguments[type]}
      label={label}
      enable={() => setType("copy")}
      disable={() => setType(null)}
    >
      {() => (
        <Box width="140px" display="flex">
          <FormControl variant="outlined" fullWidth>
            <Select
              value={commandArguments[type]}
              onChange={eventValue(setType)}
            >
              {items.map(({ name, value, disabled }) => (
                <MenuItem key={value} disabled={disabled} value={value}>
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
