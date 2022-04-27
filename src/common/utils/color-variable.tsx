import tinycolor from 'tinycolor2'

import {
  PREVIEWER_CLASS,
  PAGE_CONTAINER_CLASS,
  IS_SET_CORLOR_VARIABLE_KEY,
} from '@/common/constant'
import {
  COLOR_VARIABLES,
  KEY_OF_COLOR_VARIABLES,
} from '@/common/constant/color-variable'
import { ColorVarValue } from '@/typings/common/editer-config-data'

export const getColorVariableValue = (sourceElement?: 'body' | 'previewer') => {
  const varValue: ColorVarValue = {}

  let targetElement = document.body

  if (sourceElement === 'previewer') {
    const previewElement = document.querySelector(
      `.${PREVIEWER_CLASS}`
    ) as HTMLElement | null
    // 判断 previewer 是否 设置过颜色变量 ，总而判断 变量的读取元素
    const isSetColored = Boolean(
      previewElement &&
        getComputedStyle(previewElement).getPropertyValue(
          IS_SET_CORLOR_VARIABLE_KEY
        )
    )

    targetElement =
      previewElement && isSetColored ? previewElement : document.body
  }

  KEY_OF_COLOR_VARIABLES.forEach((key) => {
    const { varKey } = COLOR_VARIABLES[key]
    const value = getComputedStyle(targetElement)
      .getPropertyValue(varKey)
      .trim()

    // rgb/rgba 转换为 hex
    varValue[key] = tinycolor(value).toHexString()
  })

  return varValue
}

export const setColorVariableValue = (
  varValue: ColorVarValue,
  isEditer = false
) => {
  const targetClass = isEditer
    ? `.${PREVIEWER_CLASS}`
    : `.${PAGE_CONTAINER_CLASS}`

  const targetElement = document.querySelector(
    targetClass
  ) as HTMLElement | null

  if (!targetElement) return

  KEY_OF_COLOR_VARIABLES.forEach((key) => {
    const { varKey } = COLOR_VARIABLES[key]
    const value = varValue[key]
    targetElement.style.setProperty(varKey, value)
  })
  // 标记 previewer 设置过颜色
  if (isEditer) {
    targetElement.style.setProperty(IS_SET_CORLOR_VARIABLE_KEY, '1')
  }
}

// 恢复 previewer 的 颜色变为 为 body 上的 初始值
export const restorePreviewColorVariable = () => {
  const bodyValue = getColorVariableValue('body')
  setColorVariableValue(bodyValue, true)
}
