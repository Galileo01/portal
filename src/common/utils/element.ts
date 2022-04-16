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

// 获取 RCRendered id
export const getIdFromElementOrParent = (element: HTMLElement) => {
  const ele = getRCRenderedParentElement(element)
  return ele?.id
}

// 获取 previewer 子元素 父元素 对应 RCR 的 下标
export const getComponentDataIndexFromElement: (
  componentDataList: ComponentDataList,
  element: HTMLElement
) => number = (componentDataList, element) => {
  const id = getIdFromElementOrParent(element)

  const index = id
    ? componentDataList.findIndex((component) => component.id === id)
    : -1
  return index
}

const getIndexInParent = (element: HTMLElement) => {
  const tagName = element.tagName.toLowerCase()
  let index = 1
  let ele = element
  while (ele.previousElementSibling) {
    ele = ele.previousElementSibling as HTMLElement
    if (ele.tagName.toLowerCase() === tagName) {
      index += 1
    }
  }
  return index
}

// 获取 传入 元素 回溯到 RCRendered  的唯一 css 选择器
export const generateSelector = (element: HTMLElement) => {
  const index = getIndexInParent(element)
  let selector = ''
  let ele = element
  // 本身 是 previewer
  if (isPreviewerElement(element)) {
    return `.${PREVIEWER_CLASS}`
  }

  // 本身就是 RCRendered
  if (isRCRenderedElement(element)) {
    return `#${ele.id}`
  }

  // 顺着 DOM树 回溯 到RCRendered
  while (!isRCRenderedElement(ele) && ele.parentElement) {
    const { className, id, localName } = ele
    selector =
      localName +
      (className ? `.${className}` : '') +
      (id ? `#{${id}}` : '') +
      (selector ? `>${selector}` : '')
    ele = ele.parentElement
  }

  // 回溯到  RCRendered
  if (isRCRenderedElement(ele)) {
    selector = `#${ele.id}${selector ? `>${selector}` : ''}`
  }

  // 添加 :nth-of-type 保证唯一性
  selector += `:nth-of-type(${index})`
  return selector
}

// 根据 选择器 生成 唯一id，用户 style 节点的 id
export const generateUniqueNodeFromSelector = (selector: string) => {
  //  提取 选择器 中的单词(0-9 A-Z a-z _) 拼接为id
  const replaceReg = /[>:]/g
  const filterReg = /\w/

  const chars = selector.replace(replaceReg, '_').split('')
  const reg = filterReg
  return chars.filter((char) => reg.test(char)).join('')
}

export const updateStyleNodeInnerHTML = (
  styleNodeId: string,
  innerHTML: string
) => {
  let targetNode = document.querySelector(`style#${styleNodeId}`)
  const nodeTargetExisted = Boolean(targetNode)
  if (!nodeTargetExisted) {
    targetNode = document.createElement('style')
    targetNode.id = styleNodeId
    targetNode.setAttribute('type', 'text/css')
  }

  targetNode!.innerHTML = innerHTML

  if (!nodeTargetExisted) {
    document.head.appendChild(targetNode!)
  }
}

export const removeStyleNode = (styleNodeId: string) => {
  const styleNode = document.querySelector(`style#${styleNodeId}`)
  if (styleNode) {
    document.head.removeChild(styleNode)
  }
}
