import { ResourceBaseInfo } from './resource'
import { UserInfo } from './user'

export type TemplateType = 'user' | 'platform'

export type TemplateBaseInfo = ResourceBaseInfo & {
  private: number
  type: TemplateType
  userInfo: UserInfo
}

export type TemplateInfo = TemplateBaseInfo & {
  config: string
}

export type TemplateBaseInfoList = Array<TemplateBaseInfo>

export type TemplateInfoList = Array<TemplateInfo>
