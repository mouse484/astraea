export function setTitle(title?: string) {
  const trimmedTitle = title === undefined || title === null ? '' : title.trim()

  return {
    title: trimmedTitle === '' ? 'Astraea' : `${trimmedTitle} - Astraea`,
  }
}
