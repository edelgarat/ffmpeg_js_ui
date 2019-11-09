import React from "react";
import { assoc } from "ramda";

interface CommandArgumentsInterface {
  input: Record<string, string>;
  output: {
    resize?: [number, number];
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
  keyof (
    | CommandArgumentsInterface["input"]
    | CommandArgumentsInterface["output"]),
  (data: any) => string[]
> = {
  resize: ([width, height]) => ["-vf", `scale=${width}:${height}`],
};

function getCommandArray(command: CommandInterface, basePath = "") {
  const result = ["ffmpeg", "-threads", "1", "-loglevel", "debug", "-nostdin"];

  command.inputs.forEach(input => {
    result.push("-i", `${basePath}${input}`);
  });

  result.push(`${basePath}output.${command.outputFileExtension}`);

  Object.keys(command.arguments.output).forEach(key => {
    if (!command.arguments.output[key]) return;
    result.push(
      ...commandConfigFromArgument[key](command.arguments.output[key]),
    );
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
      input: {},
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
