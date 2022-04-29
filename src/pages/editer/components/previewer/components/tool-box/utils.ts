import {
  RESOURCE_COMPONENT_WILL_STICKY_CLASS,
  PREVIEWER_CONTAINER_CLASS,
} from '@/common/constant'

export type Style = {
  width: number
  height: number
  left: number
  top: number
}
export type OffsetInfo = {
  offsetLeft: number
  offsetTop: number
}

// 计算 偏移信息
// 向上查找  直到 offsetParent 为 PREVIEWER_CONTAINER
export const computeOffsetInfo: (targetElement: HTMLElement) => OffsetInfo = (
  targetElement
) => {
  let element = targetElement
  let offsetLeft = 0
  let offsetTop = 0

  while (
    !element.classList.contains(PREVIEWER_CONTAINER_CLASS) &&
    element.offsetParent
  ) {
    const { offsetLeft: curLeft, offsetTop: curTop } = element
    offsetLeft += curLeft
    offsetTop += curTop
    element = element.offsetParent as HTMLElement
  }
  return {
    offsetLeft,
    offsetTop,
  }
}

export const computeStyle: (targetElement: HTMLElement) => Style = (
  targetElement
) => {
  const { offsetHeight, offsetWidth } = targetElement
  const { offsetLeft, offsetTop } = computeOffsetInfo(targetElement)
  return {
    width: offsetWidth,
    height: offsetHeight,
    left: offsetLeft,
    top: offsetTop,
  }
}

// 根据 目标元素， 判断是否要监听  ARCO_LAYOUT_CONTENT_CLASS 的滚动事件来 更新
export const judgeShouldListenScroll: (
  targetElement: HTMLElement
) => boolean = (targetElement) => {
  // 1.类名 包含  RESOURCE_COMPONENT_WILL_STICKY_CLASS
  if (targetElement.classList.contains(RESOURCE_COMPONENT_WILL_STICKY_CLASS))
    return true

  // 2. position === 'sticky' 情况下需要监听
  if (getComputedStyle(targetElement).getPropertyValue('position') === 'sticky')
    return true

  return false
}
