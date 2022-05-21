import * as React from 'react'

import { FontList, FontType } from '@/typings/database'

export const filterFontByType = (fontList: FontList, type: FontType) =>
  fontList.filter((font) => font.type === type)

// 添加 value  和 label 属性 ，对于 系统存在的字体 直接使用 font-family 展示 字体效果
export const addOptionProps = (fontList: FontList, type: FontType) =>
  fontList.map(({ name, ...rest }) => ({
    ...rest,
    value: name,
    label:
      type === 'system_exist' ? (
        <span
          style={{
            fontFamily: name,
          }}
        >
          {name}
        </span>
      ) : (
        name
      ),
  }))

export const computeCascaderOptions = (fontList: FontList) => {
  const options = []

  const systemExist = addOptionProps(
    filterFontByType(fontList, 'system_exist'),
    'system_exist'
  )
  const platformProvide = addOptionProps(
    filterFontByType(fontList, 'platform_provide'),
    'platform_provide'
  )
  const userAdd = addOptionProps(
    filterFontByType(fontList, 'user_add'),
    'user_add'
  )

  if (systemExist.length > 0) {
    options.push({
      label: '系统内置',
      value: 'system_exist',
      children: systemExist,
    })
  }
  if (platformProvide.length > 0) {
    options.push({
      label: '平台提供',
      value: 'platform_provide',
      children: platformProvide,
    })
  }
  if (userAdd.length > 0) {
    options.push({
      label: '用户添加',
      value: 'user_add',
      children: userAdd,
    })
  }
  return options
}
