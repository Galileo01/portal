import * as React from 'react'

export type CommonProps = {
  id?: string
  draggable?: boolean
}

export enum ComponentCategoryEnum {
  NAVIGATION = 'navigation',
  BANNER = 'banner',
}

export enum PropTypeEnum {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  FUNCTION = 'function',
  OBJECT = 'object',
}

// 组件的属性描述
export type PropsTypeDesc = {
  label: string // prop 中文名
  type: PropTypeEnum // prop类型字符串  根据类型 渲染的不同的 表单

  // TODO: 完善 这几位复杂 类型
  itemType?: PropTypeEnum // 当type 为 array 时 指明每一项的类型
}

export type ResourceComponent = {
  name: string
  key: string
  category: ComponentCategoryEnum
  previewImg: string
  component: React.FC<CommonProps>
  // 组件 需要的props ,  使用 jsonSchema 进行 描述
  propsSchema: object
  // 组件 的 初始 props
  initProps: object
}
