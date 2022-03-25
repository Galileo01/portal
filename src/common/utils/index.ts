export const calculateIsDevFromQuery = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return (
    Boolean(searchParams.get('is_dev')) ||
    Boolean(searchParams.get('is_preview'))
  )
}

export const IS_DEV =
  process.env.NODE_ENV === 'development' || calculateIsDevFromQuery()

export const devLogger = (...args: unknown[]) => {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.log('[devLogger]', ...args)
  }
}

export default devLogger
