export function formatTime(second) {
  if (second >= 60) {
    return `${Math.floor(Number(second) / 60)}小时`;
  } else {
    return `${second}分钟`;
  }
}
