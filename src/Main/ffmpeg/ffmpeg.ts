import { EventEmitter } from "events";

export default class FFMPEG extends EventEmitter {
  static convertUint8ArrayToBlob(data: Uint8Array) {
    return new Blob([data]);
  }

  private str2ptr(s: string) {
    const ptr = this.ffmpegRaw._malloc(
      (s.length + 1) * Uint8Array.BYTES_PER_ELEMENT,
    );
    for (let i = 0; i < s.length; i++) {
      this.ffmpegRaw.setValue(ptr + i, s.charCodeAt(i), "i8");
    }
    this.ffmpegRaw.setValue(ptr + s.length, 0, "i8");
    return ptr;
  }

  private strList2ptr(strList: string[]) {
    const listPtr = this.ffmpegRaw._malloc(
      strList.length * Uint32Array.BYTES_PER_ELEMENT,
    );

    strList.forEach((s, idx) => {
      const strPtr = this.str2ptr(s);
      this.ffmpegRaw.setValue(listPtr + 4 * idx, strPtr, "i32");
    });

    return listPtr;
  }

  private ffmpegRaw;
  private ffmpeg;
  private reader: FileReader;

  constructor(private ffmpegRawBuilder) {
    super();
    this.ffmpegRaw = ffmpegRawBuilder({
      print: this.ffmpegPrint,
      printErr: this.ffmpegPrintError,
    });

    this.ffmpeg = this.ffmpegRaw.cwrap("ffmpeg", "number", [
      "number",
      "number",
    ]);

    this.reader = new FileReader();

    this.ffmpegRaw.FS.mkdir("src");
  }

  private isRepeatMessage(msg: string) {
    return msg.includes("Last message repeated");
  }

  private ffmpegPrint = (msg: string) => {
    if (this.isRepeatMessage(msg)) return;
    this.emit("log", msg);
  };

  private ffmpegPrintError = (msg: string) => {
    if (this.isRepeatMessage(msg)) return;
    this.emit("log", msg);
  };

  run(command: string[]) {
    this.ffmpeg(command.length, this.strList2ptr(command));
  }

  // private transocde(inputExtension: string, outputExtension: string) {
  //   const input = `input.${inputExtension}`;
  //   const args = [
  //     "./ffmpeg",
  //     "-loglevel",
  //     "debug",
  //     "-threads",
  //     "1",
  //     "-nostdin",
  //     "-y",
  //     "-i",
  //     input,
  //     `output.${outputExtension}`,
  //   ];
  //   this.ffmpegRaw.FS.writeFile(input, this.fileU8Array);
  //   this.run(args);
  //   return this.ffmpegRaw.FS.readFile(`output.${outputExtension}`);
  // }

  loadFile(name: string, file: File) {
    const blob = new Blob([file], { type: file.type });
    return new Promise(resolve => {
      this.reader.onload = event => {
        const fileU8Array = new Uint8Array(event.target.result as ArrayBuffer);
        this.ffmpegRaw.FS.writeFile(`./src/${name}`, fileU8Array);
        resolve();
      };
      this.reader.readAsArrayBuffer(blob);
    });
  }

  runWatcher(callback: (data: WatcherCallbackDataInterface) => void) {
    const timer = setInterval(() => {
      const directory = this.ffmpegRaw.FS.root.contents.src.contents;
      const result = {};
      Object.keys(directory).forEach(file => {
        result[directory[file].name] = directory[file].contents;
      });
      callback(result);
    }, 1000);
    return () => clearInterval(timer);
  }

  removeFile(name: string) {
    this.ffmpegRaw.FS.rm(name);
  }
}

export interface WatcherCallbackDataInterface {
  [name: string]: Uint8Array;
}
