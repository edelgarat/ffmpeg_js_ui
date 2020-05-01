import { EventEmitter } from "events";

import { tsToJs } from "libs/tsToJs";

const worker = import("!!raw-loader!./ffmpeg.worker");

export default class FFMPEG extends EventEmitter {
  private worker: Worker;

  constructor(private ffmpegModuleString: string) {
    super();
    this.init();
  }

  private async init() {
    const workerValue = await worker;

    const blob = new Blob([
      `
const exports = {};
${this.ffmpegModuleString}
${tsToJs(workerValue.default)}
ffmpegWorker();
`,
    ]);

    this.worker = new Worker(URL.createObjectURL(blob));
    this.prepareWorker();
  }

  private prepareWorker() {
    this.worker.postMessage(`${document.location.href}static/js/`);

    const listener = ({ data: { type, data } }) => {
      switch (type) {
        case "synchronizeFileSystem":
          this.emit("synchronizeFileSystem", data);
          break;
        case "log":
          this.emit("log", data);
          break;
      }
    };

    this.worker.addEventListener("message", listener);
  }

  run(command: string[]) {
    this.worker.postMessage({
      type: "run",
      data: command,
    });
  }

  loadFile(name: string, file: File) {
    const reader = new FileReader();
    const blob = new Blob([file], { type: file.type });
    return new Promise(resolve => {
      reader.onload = event => {
        this.worker.postMessage({
          type: "loadFile",
          data: {
            name,
            array: event.target.result,
          },
        });
        resolve();
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  runWatcher(callback: (data: WatcherCallbackDataInterface) => void) {
    const listener = ({ data: { type, data } }) => {
      if (type === "fileWatcherTick") callback(data);
    };

    this.worker.addEventListener("message", listener);
    return () => this.worker.removeEventListener("message", listener);
  }

  removeFile(name: string) {
    this.worker.postMessage({
      type: "removeFile",
      data: name,
    });
  }

  synchronizeFileSystem(fileNames: string[]) {
    this.worker.postMessage({
      type: "synchronizeFileSystem",
      data: fileNames,
    });
  }
}

export interface WatcherCallbackDataInterface {
  [name: string]: true;
}
