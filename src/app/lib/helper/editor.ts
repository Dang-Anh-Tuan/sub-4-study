export function generateTick(duration: number, numOfTicks: number) {
  if (!duration || !numOfTicks) return []
  const result = []
  const spaceTick = duration / numOfTicks
  for (let index = 0; index < numOfTicks + 1; index++) {
    result.push(Math.floor(index * spaceTick))
  }
  return result
}

export function generateMinorTick(ticks: number[], numOfMinorTick: number) {
  if (!ticks || ticks?.length === 0 || !numOfMinorTick) return []
  const result = []
  for (let index = 0; index < ticks.length - 1; index++) {
    const startTick = ticks[index]
    const endStick = ticks[index + 1]
    const spaceMinorTick = (endStick - startTick) / numOfMinorTick
    for (let j = 1; j <= numOfMinorTick - 1; j++) {
      result.push(startTick + j * spaceMinorTick)
    }
  }

  return result
}

export function displayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}
