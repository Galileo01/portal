import {
  ROUTE_EDITER,
  ROUTE_PAGE,
  DISABLE_ERROR_REDIRECT_PARAMS,
} from '@/common/constant/route'
import { ResourceType } from '@/typings/database'
import { EditType } from '@/typings/common/editer'

import { getUniqueId, IS_DEV } from './index'

export type EditerSearchGenerateParams = {
  resource_id: string
  edit_type?: string
  use_local?: boolean
  resource_type?: ResourceType
}

// 字符串 对象为 search 部分参数
export const stringfySearch = (
  params: Record<string, string | number | undefined>
) => {
  const keys = Object.keys(params)
  // 生成  search 部分
  const search = keys.reduce((preValue, curKey) => {
    const value = params[curKey]
    if (value) return `${preValue}${preValue ? '&' : '?'}${curKey}=${value}`
    return preValue
  }, '')

  return search
}

export const generateEditerSearch = (params: EditerSearchGenerateParams) => {
  const { edit_type, use_local, ...rest } = params
  const transformedParams: Record<string, string | undefined> = {
    ...rest,
    edit_type: params.edit_type || EditType.CREATE,
    use_local: params.use_local ? '1' : '0',
    [DISABLE_ERROR_REDIRECT_PARAMS]: IS_DEV ? '1' : undefined, // dev环境  发生错误时 不会强制 重定向到首页
  }
  return stringfySearch(transformedParams)
}

export const generateEditerPath = (params: EditerSearchGenerateParams) =>
  `${ROUTE_EDITER}${generateEditerSearch(params)}`

export type PageSearch = {
  resource_id: string
  resource_type: ResourceType | string
}

// 某些场景下需要 包含域名的 完整url
export const generatePagePath = (params: PageSearch, needOrigin = false) =>
  // eslint-disable-next-line no-restricted-globals
  `${needOrigin ? location.origin : ''}${ROUTE_PAGE}${stringfySearch(params)}`

export const createNewResourcePath: (resource_type?: ResourceType) => string = (
  resource_type = 'page'
) => {
  const resourceId = getUniqueId()
  return generateEditerPath({
    resource_id: resourceId,
    edit_type: EditType.CREATE,
    resource_type,
  })
}
