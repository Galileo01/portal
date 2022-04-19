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

export const customJsonParse = <T = unknown>(str: string, defaultValue?: T) => {
  try {
    return JSON.parse(str) as T
  } catch (err) {
    devLogger('customJsonParse failed err:', err)
    // eslint-disable-next-line no-console
    console.warn('customJsonParse failed err:', err)
    return defaultValue
  }
}

export const compose =
  <T = any>(...funs: Function[]) =>
  (...args: any[]) =>
    funs.reduceRight(
      (preValue, curFun) =>
        // preVal 遍历过程中 可能为单个值 或 值的数组；而concat 同时 接收数组 和 参数列表(逗号分隔)
        // eslint-disable-next-line prefer-spread
        curFun.apply(null, [].concat(preValue as any | any[])),
      args
    ) as unknown as T

export const createANewPage = () => {
  const pageId = getUniqueId()
  return {
    pageId,
    path: `${ROUTE_EDITER}?page_id=${pageId}&edit_type=create`,
  }
}
