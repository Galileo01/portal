import {
  GetLocalStorageFun,
  SetLocalStorageFun,
  PageConfigStorageValue,
} from '@/typings/common/storage'
import { PageConfig } from '@/typings/common/editer'

import { safeJsonParse } from './index'

export const getLocalStorage: GetLocalStorageFun = (key, defaultValue) =>
  localStorage.getItem(key) || defaultValue

export const setLocalStorage: SetLocalStorageFun = (key, value) =>
  localStorage.setItem(key, value)

export const getAllResourceConfig = () =>
  safeJsonParse<PageConfigStorageValue>(
    getLocalStorage('page_configs') || '{}',
    {}
  )

export const setPageConfigById = (
  resourceId: string,
  pageConfig: PageConfig
) => {
  const prePageConfigs = getAllResourceConfig()!
  prePageConfigs[resourceId] = pageConfig
  setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
}

export const getPageConfigById = (resourceId: string) => {
  const prePageConfigs = getAllResourceConfig()
  return prePageConfigs?.[resourceId]
}

export const clearResourceConfig = (resourceId?: string) => {
  if (resourceId) {
    const prePageConfigs = getAllResourceConfig()!
    // 删除 对应 pageID 的页面配置
    delete prePageConfigs[resourceId]
    setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
  } else {
    // 清空所有
    setLocalStorage('page_configs', '')
  }
}
