import React from "react";
import { assoc } from "ramda";

export interface CommandArgumentsInterface {
  bitrate?: [string, string];
  extractPartition?: [string, string];
  videoCodec?: string;
  audioCodec?: string;
  resize?: [string, string];
}

export interface CommandInterface {
  inputs: string[];
  outputFileExtension: string;
  arguments: CommandArgumentsInterface;
}

export interface CommandControllerInterface {
  commandArguments: CommandArgumentsInterface;
  setArguments: (commandArguments: CommandArgumentsInterface) => void;
}

const commandConfigFromArgument: Record<
  keyof CommandArgumentsInterface,
  (data: any) => string[]
> = {
  bitrate: ([video, audio]) => [
    ...(video ? ["-b:v", video] : []),
    ...(audio ? ["-b:a", audio] : []),
  ],
  resize: ([width, height]) => ["-vf", `scale=${width}:${height}`],
  extractPartition: ([from, length]) => ["-ss", from, "-t", length],
  videoCodec: codec => ["-c:v", codec],
  audioCodec: codec => ["-c:a", codec],
};

function applyCommandToString(
  key: string,
  argumentBase: CommandArgumentsInterface,
  result: string[],
) {
  if (!argumentBase[key]) return;
  result.push(...commandConfigFromArgument[key](argumentBase[key]));
}

function getCommandArray(
  command: CommandInterface,
  basePath = "",
  fileNamePostfix = "",
) {
  const result = [
    "ffmpeg",
    // "-threads",
    // "1",
    // "-y",
    "-loglevel",
    "debug",
    // "-nostdin",
  ];

  command.inputs.forEach(input => {
    result.push("-i", `${basePath}${input}`);
  });

  // result.push("-strict", "-2");

  Object.keys(command.arguments).forEach(key => {
    applyCommandToString(key, command.arguments, result);
  });

  result.push(
    `${basePath}output${fileNamePostfix}.${command.outputFileExtension}`,
  );

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
      audioCodec: "copy",
      videoCodec: "copy",
    },
  }));

  return {
    command,
    setInputs: (inputs: string[]) =>
      setCommand(assoc("inputs", inputs, command)),
    setOutputExtension: (extension: string) =>
      setCommand(assoc("outputFileExtension", extension, command)),
    getString: () => getCommandString(command),
    getArray: (basePath, fileNamePostfix?: string) =>
      getCommandArray(command, basePath, fileNamePostfix),
    setArguments: (commandArguments: CommandArgumentsInterface) =>
      setCommand(assoc("arguments", commandArguments, command)),
  };
}
