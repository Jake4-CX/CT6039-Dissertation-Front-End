export default function formatBytes(bytes: number, dm = 2) {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    sizes = [`${bytes <= 1 ? "Byte" : "Bytes"}`, 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}