export default class FFMPEG {
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

  private ffmpeg;
  private reader: FileReader;
  private fileU8Array: Uint8Array;

  constructor(private ffmpegRaw) {
    this.ffmpeg = ffmpegRaw.cwrap("ffmpeg", "number", ["number", "number"]);
    this.reader = new FileReader();
  }

  private transocde(inputExtension: string, outputExtension: string) {
    const input = `input.${inputExtension}`;
    const args = ["./ffmpeg", "-i", input, `output.${outputExtension}`];
    console.log("args", args);
    this.ffmpegRaw.FS.writeFile(input, this.fileU8Array);
    this.ffmpeg(args.length, this.strList2ptr(args));
    return this.ffmpegRaw.FS.readFile(`output.${outputExtension}`);
  }

  loadFile(file: File, outputExtension: string) {
    const blob = new Blob([file], { type: file.type });
    return new Promise(resolve => {
      this.reader.onload = event => {
        this.fileU8Array = new Uint8Array(event.target.result as ArrayBuffer);
        const inputExt = file.name.split(".").pop();
        resolve(this.transocde(inputExt, outputExtension));
      };
      this.reader.readAsArrayBuffer(blob);
    });
  }
}
