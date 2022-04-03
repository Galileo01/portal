import * as React from 'react'

import { Form, Input, Switch, Button, Select } from '@arco-design/web-react'
import {
  IconDelete,
  IconArrowRise,
  IconArrowFall,
  IconPlus,
} from '@arco-design/web-react/icon'
import clsx from 'clsx'

import { ComponentDataItem } from '@/typings/editer'
import {
  PropsTypeDesc,
  PropTypeEnum,
  PLAIN_TYPE_LIST,
  OptionsType,
} from '@/typings/resosurce-component'

import styles from './index.module.less'
import { devLogger } from '@/common/utils'

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
      const addDisable = maxItems ? fields.length === maxItems : false
      const removeDisable = minItems ? fields.length === minItems : false
      /**
       * 可编辑的情况
       * 1.  maxItems !== minItems ：个数不固定
       * 2.  maxItems === minItems && fields.length !== maxItems ：个数虽然固定 但是 没有达到该个数
       */
      const canAddOrRemove =
        maxItems !== minItems ||
        (maxItems === minItems && fields.length !== maxItems)

      const title = generateFormListTitle(label, minItems!, maxItems!)

      devLogger(
        'fields',
        fields,
        'addDisable',
        addDisable,
        'removeDisable',
        removeDisable,
        'canAddOrRemove',
        canAddOrRemove
      )

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
                  {canAddOrRemove && (
                    <IconDelete
                      key={`${field.field}_remove`}
                      className={clsx(
                        styles.oprate_btn,
                        removeDisable && styles.oprate_btn_disable
                      )}
                      onClick={() => remove(index)}
                    />
                  )}
                  <MoveIcon
                    key={`${field.field}move`}
                    className={styles.oprate_btn}
                    onClick={() =>
                      move(index, index > 0 ? index - 1 : index + 1)
                    }
                  />
                </div>
              </div>
            )
          })}
          {canAddOrRemove && (
            <Button
              key={`${key}_add`}
              icon={<IconPlus />}
              disabled={addDisable}
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
