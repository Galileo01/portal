import { ROUTE_EDITER } from '@/common/constant/route'
import { StringKeyValueObject } from '@/typings/common/editer-config-data'
import { getUniqueId } from './index'

export type EditerSearchGenerateParams = {
  resource_id: string
  edit_type?: string
  use_local?: boolean
  title?: string
}

export const generateEditerSearch = (params: EditerSearchGenerateParams) => {
  const { edit_type, use_local, ...rest } = params
  const transformedParams: StringKeyValueObject = {
    ...rest,
    edit_type: params.edit_type || 'create',
    use_local: params.use_local ? '1' : '0',
  }

  const keys = Object.keys(transformedParams)
  const search = keys.reduce((preValue, curKey) => {
    const value = transformedParams[curKey]
    if (value) return `${preValue}${preValue ? '&' : '?'}${curKey}=${value}`
    return preValue
  }, '')
  return search
}

export const generateEditerPath = (params: EditerSearchGenerateParams) => {
  const search = generateEditerSearch(params)
  return ROUTE_EDITER + search
}

export const createNewEditerPath = () => {
  const resourceId = getUniqueId()
  return generateEditerPath({ resource_id: resourceId, edit_type: 'create' })
}
