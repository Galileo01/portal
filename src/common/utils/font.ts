import { FontList } from '@/typings/database'

import {
  PREVIEWER_CLASS,
  FONT_STYLE_NODE_ID,
  PAGE_CONTAINER_CLASS,
} from '@/common/constant'

import { updateStyleNodeInnerHTML, removeStyleNode } from './element'

export const updateGlobalFont = (globalFont: string, isEditer = false) => {
  const targetElement = document.querySelector(
    `.${isEditer ? PREVIEWER_CLASS : PAGE_CONTAINER_CLASS}`
  ) as HTMLElement | null

  if (targetElement) {
    targetElement.style.setProperty('font-family', globalFont)
  }
}

export const createFontStyleNode = (fontList: FontList) => {
  const innerHTML = fontList.reduce((pre, cur) => {
    const { name, src } = cur
    return `${pre}
    @font-face{
      font-family:"${name}";
      font-display:swap;
      ${src ? ` src:url("${src}")` : ''}
     ;
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

export const updateFontConfigToDOM = (
  globalFont: string | undefined,
  usedFont: FontList,
  isEditer = false
) => {
  if (usedFont.length > 0) createFontStyleNode(usedFont)
  updateGlobalFont(globalFont || '', isEditer)
}
