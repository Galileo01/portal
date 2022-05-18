export type CodeOutputData = {
  pageId: string
  type: 'src_code' | 'builded'
  pageConfig?: string
}

export type CodeOutputRes = {
  zipName: string
  costTime: number
}
