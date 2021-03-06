/* eslint-disable no-console */
import { nanoid } from 'nanoid'

import { NANO_ID_LENGTH } from '@/common/constant'
import { getLocalStorage } from '@/common/utils/storage'

export const calculateIsDevFromQuery = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return (
    Boolean(searchParams.get('is_dev')) ||
    Boolean(searchParams.get('is_preview'))
  )
}

export const IS_DEV =
  process.env.NODE_ENV === 'development' || calculateIsDevFromQuery()

export const HAS_TOKEN = Boolean(getLocalStorage('token'))

export const devLogger = (...args: unknown[]) => {
  if (IS_DEV) {
    console.log('[devLogger]', ...args)
  }
}

export const devTimer = {
  time: (label?: string | undefined) => {
    if (IS_DEV) {
      console.time(`[devTimer] ${label}`)
    }
  },
  timeLog: (label?: string | undefined, ...args: unknown[]) => {
    if (IS_DEV) {
      console.timeLog(`[devTimer] ${label}`, ...args)
    }
  },
  timeEnd: (label?: string | undefined) => {
    if (IS_DEV) {
      console.timeEnd(`[devTimer] ${label}`)
    }
  },
}

export const getUniqueId = (preFix?: string) => {
  const id = nanoid(NANO_ID_LENGTH)
  return preFix ? `${preFix}_${id}` : id
}

export const safeJsonParse = <T = unknown>(str: string, defaultValue?: T) => {
  try {
    return JSON.parse(str) as T
  } catch (err) {
    devLogger('safeJsonParse failed err:', err)
    console.warn('safeJsonParse failed err:', err)
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

// 使用 Promise 创建延时效果
export const createTimeoutPromise = (ms: number) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve()
      clearTimeout(timer)
    }, ms)
  })
