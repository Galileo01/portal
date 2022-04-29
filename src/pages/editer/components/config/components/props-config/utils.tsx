import * as React from 'react'

import {
  Form,
  Input,
  Switch,
  Button,
  Select,
  Popover,
  InputNumber,
} from '@arco-design/web-react'
import {
  IconDelete,
  IconArrowRise,
  IconArrowFall,
  IconPlus,
  IconQuestionCircle,
} from '@arco-design/web-react/icon'

import { ComponentDataItem } from '@/typings/common/editer'
import {
  PropsSchema,
  PropsSchemaObj,
  PropTypeEnum,
  PLAIN_TYPE_LIST,
  OptionsType,
} from '@/typings/common/resosurce-component'
import { isNumber } from '@/common/utils/assert'

import styles from './index.module.less'

const { Item: FormItem } = Form

const nullableTransformer = (value: any) => value || undefined

// 处理 简单 类型的  表单生成
export const generateFormItemInner = (
  label: string,
  propType: PropTypeEnum,
  emptyHint?: string,
  unit?: string,
  enums?: OptionsType
) => {
  let element: JSX.Element | null = null
  const placeholder = emptyHint || label

  // 存在 可选值 的枚举
  if (enums) {
    element = <Select placeholder={placeholder} options={enums} />
    return element
  }

  switch (propType) {
    case PropTypeEnum.STRING:
      element = <Input placeholder={placeholder} allowClear />
      break
    case PropTypeEnum.NUMBER:
      element = <InputNumber placeholder={placeholder} suffix={unit} />
      break
    case PropTypeEnum.BOOLEAN:
      element = <Switch />
      break
    default:
      break
  }
  return element
}

// 生成 个数的 描述文案
export const computeFormListTitle = (
  label: string,
  minItems?: number,
  maxItems?: number
) => {
  if (!isNumber(minItems) || !isNumber(maxItems)) return label
  // 相等 : 个数固定
  if (maxItems === minItems) {
    return `${label} (固定${maxItems}项)`
  }
  return `${label} (${minItems} - ${maxItems}项)`
}
// 生成 带 help 帮助信息的label
export const computeEnhancedLabel = (label: string, help?: string) =>
  help ? (
    <span>
      {label}
      <Popover content={help} style={{ marginLeft: 5 }}>
        <IconQuestionCircle className="question_icon" />
      </Popover>
    </span>
  ) : (
    label
  )

// 处理  数组 类型的 表单生成  ：Form.List
export const generateFormList = (
  label: string,
  key: string,
  item?: PropsSchema['item'],
  minItems?: number,
  maxItems?: number,
  help?: string
) => (
  <Form.List field={key} key={key}>
    {(fields, { add, remove, move }) => {
      // NOTE: 假定 type =array  情况下，maxItems 和 minItems 字段都存在
      const canAdd = isNumber(maxItems)
        ? fields.length < maxItems
        : fields.length > 0
      const canDelete = isNumber(minItems) ? fields.length > minItems : true
      const canMove = fields.length > 1

      const canEdit = canAdd || canDelete
      const title = computeFormListTitle(label, minItems, maxItems)

      return (
        <div className={styles.form_list}>
          <div key={`${key}_title`} className={styles.prop_title}>
            {computeEnhancedLabel(title, help)}
          </div>
          {fields.map((field, index) => {
            const MoveIcon = index > 0 ? IconArrowRise : IconArrowFall
            let formItems: JSX.Element | JSX.Element[] | null = null

            // 数组项 是 普通 类型
            if (item && PLAIN_TYPE_LIST.includes(item.type)) {
              formItems = (
                <FormItem
                  field={field.field}
                  key={field.field}
                  label={`${index + 1}`}
                  labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 20,
                  }}
                  normalize={nullableTransformer}
                >
                  {generateFormItemInner(label, item.type)}
                </FormItem>
              )
            }
            // 数组项 是 复杂类型 - 对象  创建  FormItem 的列表
            else if (item && item.properties) {
              formItems = Object.keys(item.properties).map((subKey) => {
                const { label: subLabel, type: subType } = item.properties?.[
                  subKey
                ] || {
                  label: '',
                  type: PropTypeEnum.STRING,
                }
                const subField = `${field.field}.${subKey}`
                return (
                  <FormItem
                    field={subField}
                    key={subField}
                    wrapperCol={{
                      span: 23,
                    }}
                    normalize={nullableTransformer}
                  >
                    {generateFormItemInner(subLabel, subType)}
                  </FormItem>
                )
              })
            }

            return (
              <div className={styles.form_item_line}>
                {formItems}
                <div>
                  {canDelete && (
                    <IconDelete
                      key={`${field.field}_remove`}
                      className={styles.oprate_btn}
                      onClick={() => remove(index)}
                    />
                  )}
                  {canMove && (
                    <MoveIcon
                      key={`${field.field}move`}
                      className={styles.oprate_btn}
                      onClick={() =>
                        move(index, index > 0 ? index - 1 : index + 1)
                      }
                    />
                  )}
                </div>
              </div>
            )
          })}
          {canEdit && (
            <Button
              key={`${key}_add`}
              icon={<IconPlus />}
              disabled={!canAdd}
              style={{ marginBottom: 10, width: '100%' }}
              onClick={() => {
                add(label)
              }}
            />
          )}
        </div>
      )
    }}
  </Form.List>
)

// 递归生成 formItems
/**
 *
 * @param schema 当前正在遍历的 propSchema
 * @param parentProp 如果存在递归情况 ，parentProp 代表父属性的键
 */
const traverseGenerate = (schema: PropsSchemaObj, parentProp?: string) => {
  const elementList: JSX.Element[] = []
  const props = Object.keys(schema)

  props.forEach((prop) => {
    const {
      label,
      type,
      help,
      emptyHint,
      unit,
      minItems,
      maxItems,
      item,
      enums,
      properties,
    } = schema[prop]

    // 拼接 完整 prop
    const entireProp = `${parentProp ? `${parentProp}.` : ''}${prop}`

    // 普通类型
    if (PLAIN_TYPE_LIST.includes(type)) {
      const newElement = (
        <FormItem
          label={computeEnhancedLabel(label, help)}
          field={entireProp}
          key={entireProp}
          normalize={nullableTransformer}
          // boolean 类型的 Switch 组件对应 表单值 为checked
          triggerPropName={
            type === PropTypeEnum.BOOLEAN ? 'checked' : undefined
          }
        >
          {generateFormItemInner(label, type, emptyHint, unit, enums)}
        </FormItem>
      )
      elementList.push(newElement)
    }

    // 数组类型
    if (type === PropTypeEnum.ARRAY) {
      // NOTE: 假定对于 Array 类型的属性 必须传递 minItems 和 maxItems
      const newElement = generateFormList(
        label,
        entireProp,
        item,
        minItems,
        maxItems,
        help
      )
      elementList.push(newElement)
    }

    //  对象类型 递归 调用
    if (type === PropTypeEnum.OBJECT && properties) {
      const newElements = [
        <div key={`${entireProp}_title`} className={styles.prop_title}>
          {computeEnhancedLabel(label, help)}
        </div>,
        ...traverseGenerate(properties, entireProp),
      ]
      elementList.push(...newElements)
    }
  })

  return elementList
}

export const generatePropFormItems = (componentData: ComponentDataItem) => {
  const {
    resourceComponent: { propsSchema },
  } = componentData
  const elementList = traverseGenerate(propsSchema)
  return elementList
}
