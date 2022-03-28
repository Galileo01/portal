import { nanoid } from 'nanoid'

import { NANO_ID_LENGTH } from '@/common/constant'
import { ROUTE_EDITER } from '@/common/constant/route'

export const calculateIsDevFromQuery = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return (
    Boolean(searchParams.get('is_dev')) ||
    Boolean(searchParams.get('is_preview'))
  )
}

export const IS_DEV =
  process.env.NODE_ENV === 'development' || calculateIsDevFromQuery()

export const IS_ROUTE_EDITER = window.location.pathname === ROUTE_EDITER

export const devLogger = (...args: unknown[]) => {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.log('[devLogger]', ...args)
  }
}

export const getUniqueId = (preFix?: string) => {
  const id = nanoid(NANO_ID_LENGTH)
  return preFix ? `${preFix}_${id}` : id
}
