import * as React from 'react'

import { Form, Input, Switch, Button, Select } from '@arco-design/web-react'
import {
  IconDelete,
  IconArrowRise,
  IconArrowFall,
  IconPlus,
} from '@arco-design/web-react/icon'

import { ComponentDataItem } from '@/typings/common/editer'
import {
  PropsTypeDesc,
  PropTypeEnum,
  PLAIN_TYPE_LIST,
  OptionsType,
} from '@/typings/common/resosurce-component'

import styles from './index.module.less'

const { Item: FormItem } = Form

// 处理 简单 类型的  表单生成
export const generateFormItemInner = (
  label: string,
  propType: PropTypeEnum,
  enums?: OptionsType
) => {
  let element: JSX.Element | null = null

  // 存在 可选值 的枚举
  if (enums) {
    element = <Select placeholder={label} options={enums} />
    return element
  }

  switch (propType) {
    case PropTypeEnum.STRING:
      element = <Input placeholder={label} allowClear />
      break
    case PropTypeEnum.NUMBER:
      element = <Input type="number" />
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
export const generateFormListTitle = (
  label: string,
  minItems: number,
  maxItems: number
) => {
  // 相等 : 个数固定
  if (maxItems === minItems) {
    return `${label} (固定${maxItems}项)`
  }
  return `${label} (${minItems} - ${maxItems}项)`
}

// 处理  数组 类型的 表单生成  ：Form.List
export const generateFormList = (
  label: string,
  key: string,
  item?: PropsTypeDesc['item'],
  minItems?: number,
  maxItems?: number
) => (
  <Form.List field={key} key={key}>
    {(fields, { add, remove, move }) => {
      // NOTE: 假定 type =array  情况下，maxItems 和 minItems 字段都存在
      const canAdd = maxItems ? fields.length < maxItems : false
      const canDelete = minItems ? fields.length > minItems : false
      const canMove = fields.length > 1

      const canEdit = canAdd || canDelete
      const title = generateFormListTitle(label, minItems!, maxItems!)

      return (
        <div className={styles.form_list}>
          <div className={styles.list_title} key={`${key}_title`}>
            <FormItem
              label={title}
              labelCol={{
                span: 24,
              }}
            />
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

export const generatePropFormItems = (componentData: ComponentDataItem) => {
  const {
    resourceComponent: { propsSchema },
  } = componentData
  const elementList: JSX.Element[] = []
  const keys = Object.keys(propsSchema)

  keys.forEach((key) => {
    const { label, type, minItems, maxItems, item, enums } = propsSchema[key]
    let newElement: JSX.Element | null = null
    // 普通类型
    if (PLAIN_TYPE_LIST.includes(type)) {
      newElement = (
        <FormItem label={label} field={key} key={key}>
          {generateFormItemInner(label, type, enums)}
        </FormItem>
      )
    }
    if (type === PropTypeEnum.ARRAY) {
      newElement = generateFormList(label, key, item, minItems, maxItems)
    }

    if (newElement) {
      elementList.push(newElement)
    }
  })
  return elementList
}
