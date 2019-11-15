export interface CodecItem {
  name: string;
  value: string;
  supportedOutputs?: string[];
  disabled?: boolean;
}

export const videoCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "H.264", value: "libx264" },
  { name: "H.265", value: "libx265", disabled: true },
  { name: "MPEG-4 (part 2)", value: "mpeg4" },
  { name: "AV1", value: "libaom-av1", disabled: true },
  { name: "VP8", value: "libvpx", disabled: true },
  { name: "VP9 (google)", value: "libvpx-vp9", disabled: true },
  {
    name: "Apple ProRes",
    value: "prores",
    supportedOutputs: ["mkv"],
  },
];

export const audioCodecs: CodecItem[] = [
  { name: "Copy original", value: "copy" },
  { name: "Vorbis", value: "libvorbis", disabled: true },
  { name: "AAC", value: "aac" },
  { name: "OPUS", value: "opus" },
];
