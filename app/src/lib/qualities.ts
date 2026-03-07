export const videoQualities = [
  { label: "Best", value: "bestvideo" },
  { label: "8K", value: "bestvideo[height<=4320]" },
  { label: "4K", value: "bestvideo[height<=2160]" },
  { label: "1440p", value: "bestvideo[height<=1440]" },
  { label: "1080p", value: "bestvideo[height<=1080]" },
  { label: "720p", value: "bestvideo[height<=720]" },
  { label: "480p", value: "bestvideo[height<=480]" },
  { label: "360p", value: "bestvideo[height<=360]" },
  { label: "240p", value: "bestvideo[height<=240]" },
  { label: "Worst", value: "worstvideo" },
];

export const audioQualities = [
  { label: "Best", value: "bestaudio" },
  { label: "High", value: "bestaudio[abr>=256]" },
  { label: "Medium", value: "bestaudio[abr>=128]" },
  { label: "Low", value: "bestaudio[abr>=64]" },
  { label: "Worst", value: "worstaudio" },
];
