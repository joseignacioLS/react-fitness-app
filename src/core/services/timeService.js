export const formatSeconds = (seconds) => {
  const minutes = parseInt(seconds / 60)
  const strMinutes = minutes.toString()
  const rest = parseInt(seconds - minutes * 60)
  const strRest = rest.toString()
  return `${strMinutes}:${strRest.length < 2? "0"+strRest: strRest}`
}

