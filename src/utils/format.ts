export const one = (value: number) => value.toFixed(1)
export const two = (value: number) => value.toFixed(2)
export const percent1 = (value: number) => `${value.toFixed(1)}%`
export const signedTemp = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}°C`

export const cardinalFromAzimuth = (azimuth: number) => {
  if (azimuth === 0) return 'NORTH'
  if (azimuth === 90) return 'EAST'
  if (azimuth === 180) return 'SOUTH'
  if (azimuth === 270) return 'WEST'
  return `${azimuth.toFixed(0)}°`
}

export const formatIST = (iso: string) => {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
