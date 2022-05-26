import {
  GetByIdQuery,
  GetTemplateListRes,
  GetPageListRes,
  GetResourceListRes,
  GetResourceListQuery,
  OperateResourceData,
  DeleteByIdData,
} from '@/typings/request/resource'
import { Resource } from '@/typings/database'

import instance from './index'

const baseRoute = '/resource'

type OmitedGetResourceListQuery = Omit<GetResourceListQuery, 'resourceType'>

export const getResourceList = (params: GetResourceListQuery) =>
  instance.get<GetResourceListRes>(`${baseRoute}/getList`, {
    params,
  })

export const getPageList = (params?: OmitedGetResourceListQuery) =>
  instance.get<GetPageListRes>(`${baseRoute}/getList`, {
    params: {
      resourceType: 'page',
      ...params,
    },
  })

export const getTemplateList = (params?: OmitedGetResourceListQuery) =>
  instance.get<GetTemplateListRes>(`${baseRoute}/getList`, {
    params: {
      resourceType: 'template',
      ...params,
    },
  })

export const getResourceById = (params: GetByIdQuery) =>
  instance.get<Resource>(`${baseRoute}/getById`, {
    params,
  })

export const deleteResourceById = (data: DeleteByIdData) =>
  instance.post(`${baseRoute}/deleteById`, data)

export const operateResource = (data: OperateResourceData) =>
  instance.post<Resource>(`${baseRoute}/operate`, data)
