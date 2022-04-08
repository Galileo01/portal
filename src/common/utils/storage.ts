import {
  GetLocalStorageFun,
  SetLocalStorageFun,
  PageConfigStorageValue,
} from '@/typings/common/storage'
import { PageConfig } from '@/typings/common/editer'
import { customJsonParse } from './index'

export const getLocalStorage: GetLocalStorageFun = (key, defaultValue) =>
  localStorage.getItem(key) || defaultValue

export const setLocalStorage: SetLocalStorageFun = (key, value) =>
  localStorage.setItem(key, value)

export const getPageConfig = () =>
  customJsonParse<PageConfigStorageValue>(
    getLocalStorage('page_configs') || '{}',
    {}
  )

export const setPageConfig = (pageId: string, pageConfig: PageConfig) => {
  const prePageConfigs = getPageConfig()!
  prePageConfigs[pageId] = pageConfig

  setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
}

export const clearPageConfig = (pageId?: string) => {
  if (pageId) {
    const prePageConfigs = getPageConfig()!
    // 删除 对应 pageID 的页面配置
    delete prePageConfigs[pageId]
    setLocalStorage('page_configs', JSON.stringify(prePageConfigs))
  } else {
    setLocalStorage('page_configs', '')
  }
}
