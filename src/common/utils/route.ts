import { ROUTE_EDITER } from '@/common/constant/route'
import { StringKeyValueObject } from '@/typings/common/editer-config-data'
import { ResourceType } from '@/typings/database'
import { EditType } from '@/typings/common/editer'

import { getUniqueId } from './index'

export type EditerSearchGenerateParams = {
  resource_id: string
  edit_type?: string
  use_local?: boolean
  title?: string
  resource_type?: ResourceType
}

// 字符串 对象为 search 部分参数
export const stringfySearch = (params: Record<string, string | number>) => {
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
  const transformedParams: StringKeyValueObject = {
    ...rest,
    edit_type: params.edit_type || EditType.CREATE,
    use_local: params.use_local ? '1' : '0',
  }
  return stringfySearch(transformedParams)
}

export const generateEditerPath = (params: EditerSearchGenerateParams) => {
  const search = generateEditerSearch(params)
  return ROUTE_EDITER + search
}

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
