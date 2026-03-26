export function setTitle(title?: string) {
  return {
    title: title === undefined ? 'Astraea' : `${title} - Astraea`,
  }
}
