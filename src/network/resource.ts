import {
  GetByIdQuery,
  GetTemplateListRes,
  GetPageListRes,
  GetResourceListQuery,
  OperateResourceData,
} from '@/typings/request/resource'
import { Resource } from '@/typings/database'

import instance from './index'

const baseRoute = '/resource'

type OmitedGetResourceListQuery = Omit<GetResourceListQuery, 'resourceType'>

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

export const deleteResourceById = (resourceId: string) =>
  instance.post(`${baseRoute}/deleteById`, { resourceId })

export const operateResource = (data: OperateResourceData) =>
  instance.post(`${baseRoute}/operate`, data)
