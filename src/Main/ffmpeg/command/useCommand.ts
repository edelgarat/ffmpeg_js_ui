import React from "react";
import { assoc } from "ramda";

interface CommandArgumentsInterface {
  input: {
    extractPartition?: [string, string];
    videoCodec?: string;
    audioCodec?: string;
  };
  output: {
    resize?: [string, string];
  };
}

interface CommandInterface {
  inputs: string[];
  outputFileExtension: string;
  arguments: CommandArgumentsInterface;
}

export interface CommandControllerInterface {
  commandArguments: CommandArgumentsInterface;
  setArguments: (commandArguments: CommandArgumentsInterface) => void;
}

const commandConfigFromArgument: Record<
  | (keyof CommandArgumentsInterface["input"])
  | keyof (CommandArgumentsInterface["output"]),
  (data: any) => string[]
> = {
  resize: ([width, height]) => ["-vf", `scale=${width}:${height}`],
  extractPartition: ([from, length]) => ["-ss", from, "-t", length],
  videoCodec: codec => ["-vcodec", codec],
  audioCodec: codec => ["-acodec", codec],
};

function applyCommandToString(
  key: string,
  argumentBase:
    | CommandArgumentsInterface["input"]
    | CommandArgumentsInterface["output"],
  result: string[],
) {
  if (!argumentBase[key]) return;
  result.push(...commandConfigFromArgument[key](argumentBase[key]));
}

function getCommandArray(command: CommandInterface, basePath = "") {
  const result = [
    "ffmpeg",
    "-threads",
    "1",
    "-y",
    "-loglevel",
    "debug",
    "-nostdin",
  ];

  command.inputs.forEach(input => {
    result.push("-i", `${basePath}${input}`);
  });

  Object.keys(command.arguments.input).forEach(key => {
    applyCommandToString(key, command.arguments.input, result);
  });

  // @ts-ignore
  result.push(`${basePath}output.${command.outputFileExtension}`);

  Object.keys(command.arguments.output).forEach(key => {
    applyCommandToString(key, command.arguments.output, result);
  });

  return result;
}

function getCommandString(command: CommandInterface) {
  return getCommandArray(command).join(" ");
}

export default function useCommand() {
  const [command, setCommand] = React.useState<CommandInterface>(() => ({
    inputs: [],
    outputFileExtension: "mp4",
    arguments: {
      input: {
        audioCodec: "copy",
        videoCodec: "copy",
      },
      output: {},
    },
  }));

  return {
    command,
    setInputs: (inputs: string[]) =>
      setCommand(assoc("inputs", inputs, command)),
    setOutputExtension: (extension: string) =>
      setCommand(assoc("outputFileExtension", extension, command)),
    getString: () => getCommandString(command),
    getArray: basePath => getCommandArray(command, basePath),
    setArguments: (commandArguments: CommandArgumentsInterface) =>
      setCommand(assoc("arguments", commandArguments, command)),
  };
}
