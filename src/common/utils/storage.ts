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

export const getAllPageConfig = () =>
  safeJsonParse<PageConfigStorageValue>(
    getLocalStorage('page_configs') || '{}',
    {}
  )

export const setPageConfigById = (pageId: string, pageConfig: PageConfig) => {
  const prePageConfigs = getAllPageConfig()!
  prePageConfigs[pageId] = pageConfig
  setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
}

export const getPageConfigById = (pageId: string) => {
  const prePageConfigs = getAllPageConfig()
  return prePageConfigs?.[pageId]
}

export const clearPageConfig = (pageId?: string) => {
  if (pageId) {
    const prePageConfigs = getAllPageConfig()!
    // 删除 对应 pageID 的页面配置
    delete prePageConfigs[pageId]
    setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
  } else {
    // 清空所有
    setLocalStorage('page_configs', '')
  }
}
