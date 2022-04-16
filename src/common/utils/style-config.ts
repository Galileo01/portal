import { EDITABLE_FIELD } from '@/common/constant/style-config'
import {
  StringKeyValueObject,
  StyleConfig,
} from '@/typings/common/editer-config-data'

import { updateStyleNodeInnerHTML } from './element'
import { composedValuesTransformer } from './style-transformer'

export const computeStyleNodeInnerHtml = (
  selector: string,
  cssValue: StringKeyValueObject
) => {
  // 过滤有效值
  const attributes = Object.keys(cssValue).filter((key) =>
    EDITABLE_FIELD.includes(key)
  )

  const cssText = attributes.reduce((pre, curField) => {
    const numberReg = /^\d*$/g
    const underReg = /[_]/g
    const curAttr = curField.replace(underReg, '-') // 替换 _ 为 -

    let value = cssValue[curField]

    // 值无效 跳过
    if (value === undefined || value === '') return pre

    // 值为数字 且 属性名 不为 font-weight ，添加 px单位
    if (numberReg.test(value) && curAttr !== 'font-weight') {
      value += 'px'
    }

    return `${pre}
    ${curAttr}:${value};
    `
  }, '')

  const innerHTML = `${selector}{
    ${cssText}
  }`

  return innerHTML
}

export const updateTargetElementStyleNode = (
  styleNodeId: string,
  selector: string,
  cssValue: StringKeyValueObject
) => {
  const innerHTML = computeStyleNodeInnerHtml(selector, cssValue)
  updateStyleNodeInnerHTML(styleNodeId, innerHTML)
}

// 从配置 生成 style node, 例如  从 storege 恢复
export const generateStyleNodeFromConfig = (styleConfig: StyleConfig) => {
  styleConfig.forEach((configItem) => {
    const { selector, styleNodeId, cssAttribute } = configItem
    updateTargetElementStyleNode(
      styleNodeId,
      selector,
      composedValuesTransformer(cssAttribute)
    )
  })
}
