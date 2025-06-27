function formatSecondsToTimeString(seconds: number): string {
  if (!seconds) return "00:00:00"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
}

function formatTimeToSeconds(time: {
  minute: number
  second: number
  millisecond: number
}) {
  return time.minute * 60 + time.second + time.millisecond / 1000
}

export { formatSecondsToTimeString, formatTimeToSeconds }
