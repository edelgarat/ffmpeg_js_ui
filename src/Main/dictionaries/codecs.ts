export interface CodecItem {
  name: string;
  value: string;
  supportedOutputs?: string[];
  disabled?: boolean;
}

export const videoCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "WebP", value: "webp", disabled: true },
  { name: "H.264", value: "h264" },
  { name: "MPEG-4 (part 2)", value: "mpeg4" },
  { name: "AV1", value: "av1", disabled: true },
  { name: "VP8", value: "vp8", disabled: true },
  { name: "VP9 (google)", value: "vp9", disabled: true },
  {
    name: "Apple ProRes",
    value: "prores",
    disabled: true,
    supportedOutputs: ["mkv"],
  },
  { name: "H.265", value: "hevc", disabled: true },
];

export const audioCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "AAC", value: "aac" },
  { name: "OPUS", value: "opus" },
];
