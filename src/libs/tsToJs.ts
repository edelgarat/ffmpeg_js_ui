export const tsToJs = (func: string) => {
  return require("typescript").transpileModule(func, {}).outputText;
};
