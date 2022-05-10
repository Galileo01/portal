import {
  GetByIdQuery,
  GetTemplateListRes,
  GetPageListRes,
  GetResourceListQuery,
} from '@/typings/request/resource'

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
  instance.get(`${baseRoute}/getById`, {
    params,
  })

export const deleteResourceByid = (resourceId: string) =>
  instance.post(`${baseRoute}/deleteById`, { resourceId })
