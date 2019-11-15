import { EventEmitter } from "events";

const worker = import("./worker");

export default class FFMPEG extends EventEmitter {
  private reader: FileReader;
  private worker: Worker;

  constructor(ffmpegModuleString: string, onLoad: (ffmpeg: FFMPEG) => void) {
    super();
    this.reader = new FileReader();

    worker.then(value => {
      this.worker = new Worker(
        URL.createObjectURL(
          new Blob([
            `
${ffmpegModuleString}
const ffmpegForker=${value.default.toString()}
ffmpegForker();
`,
          ]),
        ),
      );
      this.init();
      onLoad(this);
    });
  }

  private init() {
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
    const blob = new Blob([file], { type: file.type });
    return new Promise(resolve => {
      this.reader.onload = event => {
        this.worker.postMessage({
          type: "loadFile",
          data: {
            name,
            array: event.target.result,
          },
        });
        resolve();
      };
      this.reader.readAsArrayBuffer(blob);
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
