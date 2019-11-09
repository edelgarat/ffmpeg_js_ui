import React from "react";
import { assoc } from "ramda";

interface CommandInterface {
  inputs: string[];
  outputFileExtension: string;
  arguments: { [name: string]: string };
}

function getCommandArray(command: CommandInterface, basePath = "") {
  const result = ["ffmpeg", "-threads", "1", "-loglevel", "debug", "-nostdin"];

  command.inputs.forEach(input => {
    result.push("-i", `${basePath}${input}`);
  });
  result.push(`${basePath}output.${command.outputFileExtension}`);

  result.push("-vf", "scale=320:240");

  return result;
}

function getCommandString(command: CommandInterface) {
  return getCommandArray(command).join(" ");
}

export default function useCommand() {
  const [command, setCommand] = React.useState<CommandInterface>(() => ({
    inputs: [],
    outputFileExtension: "mp4",
    arguments: {},
  }));

  return {
    command,
    setInputs: (inputs: string[]) =>
      setCommand(assoc("inputs", inputs, command)),
    setOutputExtension: (extension: string) =>
      setCommand(assoc("outputFileExtension", extension, command)),
    getString: () => getCommandString(command),
    getArray: basePath => getCommandArray(command, basePath),
  };
}
