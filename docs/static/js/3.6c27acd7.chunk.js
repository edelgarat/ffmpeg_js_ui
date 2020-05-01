(this.webpackJsonpffmpeg_front=this.webpackJsonpffmpeg_front||[]).push([[3],{354:function(n,e,t){"use strict";t.r(e),e.default='export default function ffmpegWorker() {\n  function convertUint8ArrayToBlob(data: Uint8Array) {\n    return new Blob([data]);\n  }\n\n  function isRepeatMessage(msg: string) {\n    return msg.includes("Last message repeated");\n  }\n\n  const ffmpegPrint = (msg: string) => {\n    if (isRepeatMessage(msg)) return;\n    postMessage(\n      {\n        type: "log",\n        data: msg,\n      },\n      null,\n    );\n  };\n\n  class FFMPEG {\n    private str2ptr(s: string) {\n      const ptr = this.ffmpegRaw._malloc(\n        (s.length + 1) * Uint8Array.BYTES_PER_ELEMENT,\n      );\n      for (let i = 0; i < s.length; i++) {\n        this.ffmpegRaw.setValue(ptr + i, s.charCodeAt(i), "i8");\n      }\n      this.ffmpegRaw.setValue(ptr + s.length, 0, "i8");\n      return ptr;\n    }\n\n    private strList2ptr(strList: string[]) {\n      const listPtr = this.ffmpegRaw._malloc(\n        strList.length * Uint32Array.BYTES_PER_ELEMENT,\n      );\n\n      strList.forEach((s, idx) => {\n        const strPtr = this.str2ptr(s);\n        this.ffmpegRaw.setValue(listPtr + 4 * idx, strPtr, "i32");\n      });\n\n      return listPtr;\n    }\n\n    private ffmpegRaw;\n    private ffmpeg;\n\n    constructor(ModuleBuilder, conf: Object) {\n      this.ffmpegRaw = ModuleBuilder(\n        Object.assign({ print: ffmpegPrint, printErr: ffmpegPrint }, conf),\n      );\n\n      this.ffmpeg = this.ffmpegRaw.cwrap("ffmpeg", "number", [\n        "number",\n        "number",\n      ]);\n\n      this.ffmpegRaw.FS.mkdir("src");\n\n      onmessage = ({ data: { type, data } }) => {\n        switch (type) {\n          case "run":\n            this.run(data);\n            break;\n          case "loadFile":\n            this.loadFile(data.name, new Uint8Array(data.array));\n            break;\n          case "removeFile":\n            this.removeFile(data);\n            break;\n          case "synchronizeFileSystem":\n            this.synchronizeFileSystem(data);\n            break;\n        }\n      };\n\n      this.runWatcher(files => {\n        postMessage({ type: "fileWatcherTick", data: files }, null);\n      });\n    }\n\n    run(command: string[]) {\n      this.ffmpeg(command.length, this.strList2ptr(command));\n    }\n\n    loadFile(name: string, fileU8Array: Uint8Array) {\n      this.ffmpegRaw.FS.writeFile(`./src/${name}`, fileU8Array);\n    }\n\n    runWatcher(callback: (data) => void) {\n      const timer = setInterval(() => {\n        const files = this.ffmpegRaw.FS.readdir("/src").slice(2);\n        const result = {};\n        files.forEach(file => {\n          result[file] = true;\n        });\n        callback(result);\n      }, 1000);\n      return () => clearInterval(timer);\n    }\n\n    removeFile(name: string) {\n      if (this.convertedFiles[name]) {\n        URL.revokeObjectURL(this.convertedFiles[name]);\n        this.convertedFiles[name] = null;\n      }\n      this.ffmpegRaw.FS.unlink(`/src/${name}`);\n    }\n\n    convertedFiles = {};\n\n    synchronizeFileSystem(fileNames: string[]) {\n      postMessage(\n        {\n          type: "synchronizeFileSystem",\n          data: fileNames.map(fileName => {\n            if (!this.convertedFiles[fileName]) {\n              const content = this.ffmpegRaw.FS.readFile(`/src/${fileName}`);\n\n              this.convertedFiles[fileName] = URL.createObjectURL(\n                convertUint8ArrayToBlob(content),\n              );\n            }\n\n            return {\n              fileName,\n              url: this.convertedFiles[fileName],\n            };\n          }),\n        },\n        null,\n      );\n    }\n  }\n\n  onmessage = function({ data }) {\n    new FFMPEG(\n      // @ts-ignore\n      Module,\n      { locateFile: path => data + path },\n    );\n  };\n}\n'}}]);
//# sourceMappingURL=3.6c27acd7.chunk.js.map