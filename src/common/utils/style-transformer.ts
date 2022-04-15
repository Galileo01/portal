/* eslint-disable no-param-reassign */
import { compose } from '@/common/utils'

import {
  CssAttribute,
  StringKeyValueObject,
  TextShadow,
  Backgrounds,
  BoxShadow,
} from '@/typings//common/editer-config-data'

// 表单值 到 css 样式 的转换器 formValue -> cssValue
export type ValuesTransformer = (preFormValues: CssAttribute) => CssAttribute

// css 样式 到 表单值 的转换器  cssValue -> formValue
export type FormValueGenerator<T = any> = (attrValue: string) => T

export const textShadowTransformer: ValuesTransformer = (formValues) => {
  const textShadow = formValues.text_shadow as TextShadow
  // text-shadow: x-offset y-offset blur-radius color
  if (textShadow) {
    const { x_offset, y_offset, blur_radius, color } = textShadow
    const transformed = `${x_offset || '0'}px ${y_offset || '0'}px ${
      blur_radius || '0'
    }px ${color || ''}`

    formValues.text_shadow = transformed
  }

  return formValues
}

export const backgroundFormTransformer: ValuesTransformer = (formValues) => {
  const backgrounds = formValues.backgrounds as Backgrounds
  if (backgrounds) {
    const backgroundAttrObj = backgrounds.reduce(
      (pre, curBackground) => {
        const {
          url,
          background_attachment,
          background_clip,
          background_repeat,
          background_size,
        } = curBackground

        if (background_attachment)
          pre.background_attachment += `${
            pre.background_attachment ? ',' : ''
          }${background_attachment}`

        if (background_clip)
          pre.background_clip += `${
            pre.background_clip ? ',' : ''
          }${background_clip}`

        if (background_repeat)
          pre.background_repeat += `${
            pre.background_repeat ? ',' : ''
          }${background_repeat}`

        if (background_size)
          pre.background_size += `${
            pre.background_size ? ',' : ''
          }${background_size}`

        // 图片类型的背景
        if (curBackground.background_type === 'image') {
          if (url)
            pre.background_image += `${
              pre.background_image ? ',' : ''
            }url("${url}")`
        }
        return pre
      },
      {
        background_image: '',
        background_attachment: '',
        background_clip: '',
        background_repeat: '',
        background_size: '',
      }
    )
    // 拷贝属性
    Object.assign(formValues, backgroundAttrObj)
  }

  return formValues
}

const boxShadowFormTransformer: ValuesTransformer = (formValues) => {
  const boxShadow = formValues.box_shadow as BoxShadow

  // box-shadow:x-offset y-offset blur-radius spread-radius color

  if (boxShadow) {
    const { x_offset, y_offset, blur_radius, spread_radius, color } = boxShadow
    const transformed = `${x_offset || '0'}px ${y_offset || '0'}px ${
      blur_radius || '0'
    }px ${spread_radius || '0'}px ${color || ''}`
    formValues.box_shadow = transformed
  }

  return formValues
}

// 组合
export const composedValuesTransformer = compose<StringKeyValueObject>(
  boxShadowFormTransformer,
  backgroundFormTransformer,
  textShadowTransformer
)

export const textShadowGenerator: FormValueGenerator = () => {}

// TODO: 临时 注释掉 从 样式表转为 表单  数据的  逻辑
// export const generateStyleConfigData = (targetElement: HTMLElement) => {
//   const computedStyle = getComputedStyle(targetElement)
//   const styleConfig = EDITABLE_FIELD.reduce((preConfig, curField) => {
//     if (skipField.includes(curField)) return preConfig

//     const underReg = /[_]/g
//     const pxValueReg = /^\d*px$/g
//     const cssAttr = curField.replace(underReg, '-')
//     let cssValue = computedStyle.getPropertyValue(cssAttr)

//     if (curField === 'text_shadow') {
//     }

//     // 如果 是以 px 结尾 的单独数字 则 剔除 px 单位
//     else if (pxValueReg.test(cssValue)) {
//       cssValue = `${parseInt(cssValue, 10)}`
//       cssValue.replace('px', '')
//     }
//     preConfig[curField] = cssValue

//     return preConfig
//   }, {} as CssAttribute)

//   return styleConfig
// }
