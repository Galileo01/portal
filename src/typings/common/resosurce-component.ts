import * as React from 'react'

export type CommonProps = {
  id?: string
  draggable?: boolean
  [key: string]: unknown
}

export enum ComponentCategoryEnum {
  NAVIGATION = 'navigation',
  BANNER = 'banner',
  CONTENT = 'content',
  OTHER = 'other',
  FOOTER = 'footer',
}

export const COMPONENT_CATEGORY_LABEL_MAP = {
  [ComponentCategoryEnum.NAVIGATION]: '导航',
  [ComponentCategoryEnum.BANNER]: 'Banner',
  [ComponentCategoryEnum.CONTENT]: '内容',
  [ComponentCategoryEnum.OTHER]: '其他',
  [ComponentCategoryEnum.FOOTER]: '页脚',
}

export type CategoryItem = {
  cate: ComponentCategoryEnum
  label: string
  componentList: Array<ResourceComponent>
}

export enum PropTypeEnum {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  COLOR = 'color',
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
export type PropsSchema = {
  label: string // prop 中文名 简单值的 label 最好不要超过 4个字
  type: PropTypeEnum // prop类型
  help?: string // label 帮助信息  会使用 Tooltip + IconQuestion 的方式追加在 label后面, 列表类型的属性 不会显示单个item 的 help信息
  emptyHint?: string // 输入值为空时  的提示，通常提示为空时的默认值 显示为表单组件的placeholder
  unit?: string // NUMBER 类型时可以 追加 单位显示
  enums?: OptionsType // 普通类型时 ，限定 值的可选范围（暂定单选）NOTE:
  // 数组类型 maxItems ， minItems 字段用于描述 数组长度  maxItems === minItems  时 表示 固定个数 ，不允许 更改
  maxItems?: number // 描述最大个数
  minItems?: number // 描述最小个数
  item?: Omit<PropsSchema, 'label'> // 数组 类型 时 描述 每一项
  // 对象 类型时 描述 字段
  properties?: PropsSchemaObj
}

export type PropsSchemaObj = {
  [key: string]: PropsSchema
}

export type ResourceComponent<ComponentProps = CommonProps> = {
  name: string
  key: string
  category: ComponentCategoryEnum
  previewImg: string
  component: React.FC<ComponentProps>
  // 组件 需要的props ,
  propsSchema: PropsSchemaObj
  // 组件 的  props
  props: ComponentProps
}
