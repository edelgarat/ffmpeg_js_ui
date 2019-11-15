export default function ffmpegForker() {
  function convertUint8ArrayToBlob(data: Uint8Array) {
    return new Blob([data]);
  }

  function isRepeatMessage(msg: string) {
    return msg.includes("Last message repeated");
  }

  const ffmpegPrint = (msg: string) => {
    if (isRepeatMessage(msg)) return;
    postMessage(
      {
        type: "log",
        data: msg,
      },
      null,
    );
  };

  class FFMPEG {
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

    constructor(ModuleBuilder, conf: Object) {
      this.ffmpegRaw = ModuleBuilder(
        Object.assign({ print: ffmpegPrint, printErr: ffmpegPrint }, conf),
      );

      this.ffmpeg = this.ffmpegRaw.cwrap("ffmpeg", "number", [
        "number",
        "number",
      ]);

      this.ffmpegRaw.FS.mkdir("src");

      onmessage = ({ data: { type, data } }) => {
        switch (type) {
          case "run":
            this.run(data);
            break;
          case "loadFile":
            this.loadFile(data.name, new Uint8Array(data.array));
            break;
          case "removeFile":
            this.removeFile(data);
            break;
          case "synchronizeFileSystem":
            this.synchronizeFileSystem(data);
            break;
        }
      };

      this.runWatcher(files => {
        postMessage({ type: "fileWatcherTick", data: files }, null);
      });
    }

    run(command: string[]) {
      this.ffmpeg(command.length, this.strList2ptr(command));
    }

    loadFile(name: string, fileU8Array: Uint8Array) {
      this.ffmpegRaw.FS.writeFile(`./src/${name}`, fileU8Array);
    }

    runWatcher(callback: (data) => void) {
      const timer = setInterval(() => {
        const files = this.ffmpegRaw.FS.readdir("/src").slice(2);
        const result = {};
        files.forEach(file => {
          result[file] = true;
        });
        callback(result);
      }, 1000);
      return () => clearInterval(timer);
    }

    removeFile(name: string) {
      if (this.convertedFiles[name]) {
        URL.revokeObjectURL(this.convertedFiles[name]);
        this.convertedFiles[name] = null;
      }
      this.ffmpegRaw.FS.unlink(`/src/${name}`);
    }

    convertedFiles = {};

    synchronizeFileSystem(fileNames: string[]) {
      postMessage(
        {
          type: "synchronizeFileSystem",
          data: fileNames.map(fileName => {
            if (!this.convertedFiles[fileName]) {
              const content = this.ffmpegRaw.FS.readFile(`/src/${fileName}`);

              this.convertedFiles[fileName] = URL.createObjectURL(
                convertUint8ArrayToBlob(content),
              );
            }

            return {
              fileName,
              url: this.convertedFiles[fileName],
            };
          }),
        },
        null,
      );
    }
  }

  onmessage = function({ data }) {
    new FFMPEG(
      // @ts-ignore
      Module,
      { locateFile: path => data + path },
    );
  };
}
