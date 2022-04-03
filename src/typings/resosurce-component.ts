import * as React from 'react'

export type CommonProps = {
  id?: string
  draggable?: boolean
  [key: string]: unknown
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
  OBJECT = 'object',
}

export const PLAIN_TYPE_LIST = [
  PropTypeEnum.STRING,
  PropTypeEnum.NUMBER,
  PropTypeEnum.BOOLEAN,
]

export type OptionsType = Array<{
  label: string
  value: string | number
  disabled?: boolean
}>

// 组件的属性描述  在  JsonSchema的基础上 进行扩展  进行 描述; see more in https://json-schema.apifox.cn/
export type PropsTypeDesc = {
  label: string // prop 中文名
  type: PropTypeEnum // prop类型
  enums?: OptionsType // 普通类型时 ，限定 值的可选范围（暂定单选）
  // 数组类型 maxItems ， minItems 字段用于描述 数组长度  maxItems === minItems  时 表示 固定个数 ，不允许 更改
  maxItems?: number // 描述最大个数
  minItems?: number // 描述最小个数
  item?: Omit<PropsTypeDesc, 'label'> // 数组 类型 时 描述 每一项
  // 对象 类型时 描述 字段
  properties?: PropsTypeDescObj
}

export type PropsTypeDescObj = {
  [key: string]: PropsTypeDesc
}

export type ResourceComponent = {
  name: string
  key: string
  category: ComponentCategoryEnum
  previewImg: string
  component: React.FC<CommonProps>
  // 组件 需要的props ,
  propsSchema: PropsTypeDescObj
  // 组件 的  props
  props: object
}
