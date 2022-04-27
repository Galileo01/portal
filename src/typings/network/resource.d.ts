export type ResourceBaseInfo = {
  title: string
  resourceId: string
  thumbnailUrl: string
}

export type ResourceInfo = ResourceBaseInfo & {
  config: string
}

export type ResourceBaseInfoList = Array<ResourceBaseInfo>

export type ResourceInfoList = Array<ResourceInfo>
