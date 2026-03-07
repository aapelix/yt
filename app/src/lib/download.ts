export function downloadFile(url: string, filename: string = "") {
  console.log("Initiating file download from URL:", url);
  const a = document.createElement("a");
  a.target = "_blank";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
