import { ComponentDataList } from '@/typings/common/editer'
import {
  RESOURCE_COMPONENT_RENDERED_COMMON_CLASS,
  PREVIEWER_CLASS,
} from '@/common/constant'
import { devLogger, IS_DEV } from '@/common/utils'

// 判断  元素 是否是 和 源组件直接渲染的 (最外层 容器 的 class)
export const isRCRenderedElement = (element: HTMLElement) =>
  element.classList.contains(RESOURCE_COMPONENT_RENDERED_COMMON_CLASS)

export const isPreviewerElement = (element: HTMLElement) =>
  element.classList.contains(PREVIEWER_CLASS)

// 获取 元素 符合 RCRendered 的 父元素 /或者 它本身 就符合
export const getRCRenderedParentElement = (element: HTMLElement) => {
  let ele = element
  let isRCRendered = isRCRenderedElement(ele)

  if (isRCRendered) {
    devLogger('getRCRenderedParentElement', 'return directly')
    return ele
  }

  let isPreviewer = isPreviewerElement(ele)
  const start = IS_DEV ? Date.now() : 0

  // 一直 向上查找 直到  找到  RCRendered  或者  遇到  previewer 容器
  while (!isRCRendered && !isPreviewer && ele.parentElement) {
    ele = ele.parentElement
    isRCRendered = isRCRenderedElement(ele)
    isPreviewer = isPreviewerElement(ele)
  }

  devLogger('getRCRenderedParentElement cust-time', Date.now() - start, 'ms')
  return isRCRendered ? ele : undefined
}

// 获取 id
export const getIdFromElement = (element: HTMLElement) => {
  const ele = getRCRenderedParentElement(element)
  return ele?.id
}

// 获取 previewer 子元素 父元素 对应 RCR 的 下标
export const getComponentDataIndexFromElement: (
  componentDataList: ComponentDataList,
  element: HTMLElement
) => number = (componentDataList, element) => {
  const id = getIdFromElement(element)

  const index = id
    ? componentDataList.findIndex((component) => component.id === id)
    : -1
  return index
}
