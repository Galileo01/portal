import * as React from 'react'

import { FontList, FontType } from '@/typings/network'

import {
  PREVIEWER_CLASS,
  FONT_STYLE_NODE_ID,
  PAGE_CONTAINER_CLASS,
} from '@/common/constant'
import { FontConfigData } from '@/typings/common/editer-config-data'

import { updateStyleNodeInnerHTML, removeStyleNode } from './element'

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

export const updateGlobalFont = (globalFont?: string, isEditer = false) => {
  const targetElement = document.querySelector(
    `.${isEditer ? PREVIEWER_CLASS : PAGE_CONTAINER_CLASS}`
  ) as HTMLElement | null

  if (targetElement) {
    targetElement.style.setProperty('font-family', globalFont || 'revert')
  }
}

export const createFontStyleNode = (fontList: FontList) => {
  const innerHTML = fontList.reduce((pre, cur) => {
    const { name, src } = cur
    return `${pre}
    @font-face{
      font-family:"${name}";
      font-display:swap;
      src:url("${src}");
    }`
  }, '')
  updateStyleNodeInnerHTML(FONT_STYLE_NODE_ID, innerHTML)
}

export const removeFontStyleNode = () => {
  removeStyleNode(FONT_STYLE_NODE_ID)
}

// 将最新的 字体配置 更到 元素
/**
 * 网站全局 字体
 * 网站 用到的字体
 */
export const updateFontConfigToElement = (
  fontConfig: FontConfigData,
  fontList: FontList,
  isEditer = false
) => {
  const usedFontName = fontConfig.usedFont?.map((item) => item[1]) || []
  const globalFont = fontConfig.globalFont?.[1]

  const usedFont = fontList.filter(
    (font) => font.src && usedFontName.includes(font.name)
  )

  if (usedFont.length > 0) createFontStyleNode(usedFont)

  updateGlobalFont(globalFont, isEditer)
}
