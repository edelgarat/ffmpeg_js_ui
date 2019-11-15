export interface CodecItem {
  name: string;
  value: string;
  supportedOutputs?: string[];
}

export const videoCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "H.264", value: "h264" },
  { name: "MPEG-4 (part 2)", value: "mpeg4" },
  { name: "AV1", value: "av1" },
  { name: "VP8", value: "vp8" },
  { name: "VP9 (google)", value: "vp9" },
  { name: "Apple ProRes", value: "prores", supportedOutputs: ["mkv"] },
  // { name: "H.265", value: "hevc" },
];

export const audioCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "AAC", value: "aac" },
  { name: "OPUS", value: "opus" },
];
