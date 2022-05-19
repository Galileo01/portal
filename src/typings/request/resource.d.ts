import { ResourceType, Page, Template, ResourceList } from '@/typings/database'

export type PageBase = Omit<Page, 'config'>

export type PageBaseList = Array<PageBase>

export type TemplateBase = Omit<Template, 'config'>

export type TemplateBaseList = Array<TemplateBase>

export type GetByIdQuery = {
  resourceId: string
  resourceType?: ResourceType
}

export type GetResourceListQuery = {
  resourceType?: ResourceType
  limit?: number
  offset?: number
  // template 过滤条件
  filter?: 'all' | 'private' | 'public' | 'platform'
  titleLike?: string
  order?: 'lastModified' | 'title'
}

export type GetResourceListRes<T = ResourceList> = {
  resourceList: T
  hasMore: 0 | 1
}

export type GetPageListRes = GetResourceListRes<PageBaseList>

export type GetTemplateListRes = GetResourceListRes<TemplateBaseList>

export type OperateResourceData = {
  operateType: 'publish' | 'update'
  // 资源 数据
  resourceData: {
    resourceType: ResourceType
    resourceId: string
    title: string
    thumbnailUrl: string
    config: string
    // template 字段
    private?: number
    type?: string
  }
}

export type DeleteByIdData = {
  resourceId: string
  resourceType?: ResourceType
}
