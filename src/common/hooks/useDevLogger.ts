import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

const useDevLogger = (preFix?: string) => {
  const [searchParams] = useSearchParams()

  const isDev = React.useMemo(
    () =>
      process.env.NODE_ENV === 'development' ||
      Boolean(searchParams.get('is_dev')) ||
      Boolean(searchParams.get('is_preview')),
    [searchParams]
  )

  const devLogger = React.useCallback(
    (...args: unknown[]) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.log(`[${preFix || 'devLogger'}]`, ...args)
      }
    },
    [isDev, preFix]
  )

  return devLogger
}

export default useDevLogger
