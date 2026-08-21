export function assetPath(path) {
  return `${import.meta.env.BASE_URL}assets/${path.replace(/^\/+/, '')}`
}
