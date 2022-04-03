import * as React from 'react'

import { throttle } from 'lodash-es'

import { ComponentDataItem, ComponentDataList } from '@/typings/editer'
import {
  DATASET_KEY_RESOURCE_COMPONENT_KEY,
  ARCO_LAYOUT_SIDER_CLASS,
} from '@/common/constant'
import { devLogger, getUniqueId } from '@/common/utils'
import {
  isPreviewerElement,
  getRCRenderedParentElement,
  getComponentDataIndexFromElement,
} from '@/common/utils/element'
import { RCList } from '@/resource-components'

import { ToolBoxRef, ToolBoxProps } from './components/tool-box'

const createPlaceHolder = () => {
  const placeHolder = document.createElement('div')
  placeHolder.setAttribute(
    'style',
    `height: 30px;
    width: 100%;
    background-color: rgb(var(--arcoblue-5));
    color: var(--color-bg-5);
    text-align: center;
    line-height: 30px;`
  )
  placeHolder.innerHTML = '放在此处'
  return placeHolder
}

export type useDragAndDropParams = {
  previewerElementRef: React.MutableRefObject<HTMLElement | null>
  componentDataList: ComponentDataList
  updateComponenDataList: (componentDataList: ComponentDataList) => void
  actionsBeforeHandle: () => void
}

// 处理拖拽 逻辑
export const useDragAndDrop = (params: useDragAndDropParams) => {
  const {
    previewerElementRef,
    componentDataList,
    updateComponenDataList,
    actionsBeforeHandle,
  } = params

  // placeHolder  元素
  const placeHolderElementRef = React.useRef<HTMLElement | null>(null)

  const currentDragingRCRRef = React.useRef<HTMLElement | null>(null)

  // 移除 placeHolder
  const removePlaceHolder = () => {
    // 元素 存在且 存在父子 关系
    if (
      previewerElementRef.current &&
      placeHolderElementRef.current &&
      previewerElementRef.current.contains(placeHolderElementRef.current)
    ) {
      previewerElementRef.current.removeChild(placeHolderElementRef.current)
    }
  }
  // RCR: RCRendered 拖拽开始
  const handleRCRDragStart: React.DragEventHandler<HTMLElement> = (e) => {
    actionsBeforeHandle()
    currentDragingRCRRef.current = e.target as HTMLElement
  }

  /**
   * drop 放置 事件需要处理的任务
   * 1. 根据 key 构建 ComponentDataItem
   * 2. 更新 store 存储的 componentDataList ，会触发 快照的新建
   *
   */

  const handleDrop: React.DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // 获取 组件key
    const componentKey = e.dataTransfer.getData(
      DATASET_KEY_RESOURCE_COMPONENT_KEY
    )

    let insertComponentDataItem: ComponentDataItem | null = null
    //  存在 componentKey --- 来自 resource-pane 的拖拽
    if (componentKey) {
      const targetComponent = RCList.find(
        (component) => component.key === componentKey
      )
      insertComponentDataItem = {
        id: getUniqueId(componentKey),
        resourceComponent: targetComponent!, // 排除 null 情况
      }
    }
    // 否则 -- 来自 previewer 内 已有的 RCR元素 拖拽
    else if (currentDragingRCRRef.current!) {
      const preIndex = getComponentDataIndexFromElement(
        componentDataList,
        currentDragingRCRRef.current
      )
      // 截取/删除 并返回
      // eslint-disable-next-line prefer-destructuring
      insertComponentDataItem = componentDataList.splice(preIndex, 1)[0]
    }

    const insertIndex = getComponentDataIndexFromElement(
      componentDataList,
      e.target as HTMLElement
    )
    devLogger(
      'handleDrop',
      'e.target',
      e.target,
      'e.currentTarget',
      e.currentTarget,
      'componentKey',
      componentKey,
      'insertIndex',
      insertIndex
    )

    // 插入 指定位置 或者末尾
    componentDataList.splice(
      insertIndex > -1 ? insertIndex : componentDataList.length,
      0,
      insertComponentDataItem as ComponentDataItem
    )

    updateComponenDataList(componentDataList)
    removePlaceHolder()
    currentDragingRCRRef.current = null
  }

  const insertPlaceHolderThrottled = React.useMemo(
    () =>
      throttle<(target: HTMLElement) => void>(
        (target) => {
          actionsBeforeHandle()
          if (!previewerElementRef.current || !placeHolderElementRef.current)
            return
          const isPreviewer = isPreviewerElement(target)

          // 如果是 previewer 容器 元素   直接 追加在末尾
          if (isPreviewer) {
            previewerElementRef.current?.append(placeHolderElementRef.current)
            return
          }
          // 否则 ,获取它自身 或者 父级 元素  然后添加到 前面
          const RCRenderedElement = getRCRenderedParentElement(target)
          if (RCRenderedElement) {
            previewerElementRef.current?.insertBefore(
              placeHolderElementRef.current,
              RCRenderedElement
            )
          }
        },
        500,
        // NOTE:取消 节流结束 后的那次调用 ，否则  又会 append 到 末尾
        { trailing: false }
      ),
    [previewerElementRef, actionsBeforeHandle]
  )

  React.useEffect(() => {
    placeHolderElementRef.current = createPlaceHolder()
  }, [])

  return {
    handleDragLeave: removePlaceHolder,
    handleDrop,
    handleDragOver: insertPlaceHolderThrottled,
    handleRCRDragStart,
  }
}

export type useToolBoxParams = Pick<
  useDragAndDropParams,
  'componentDataList' | 'updateComponenDataList'
> & {
  currentClickElement?: HTMLElement
  updateClickElement: (newElement?: HTMLElement) => void
}

// 处理  ToolBox 的 控制 逻辑
export const useToolBox = (params: useToolBoxParams) => {
  const {
    currentClickElement,
    componentDataList,
    updateComponenDataList,
    updateClickElement,
  } = params

  const toolBoxRef = React.useRef<ToolBoxRef>(null)

  const hiddenToolBox = () => {
    if (currentClickElement) updateClickElement(undefined)
  }

  const handleOprateBtnClick: ToolBoxProps['onOprateBtnClick'] = (
    opratetype
  ) => {
    const tempList = [...componentDataList]
    const preIndex = getComponentDataIndexFromElement(
      tempList,
      currentClickElement! // 强制 排除 null
    )
    const componentData = tempList.splice(preIndex, 1)[0]

    switch (opratetype) {
      // 上移 - 之前元素的 下标不会 发生改变
      case 'up_move':
        if (preIndex === 0) return
        tempList.splice(preIndex - 1, 0, componentData)
        break
      // 下移 - 之后元素的 下标发生改变
      case 'down_move':
        if (preIndex === componentDataList.length - 1) return
        tempList.splice(preIndex + 1, 0, componentData)
        break
      // 删除 情况  ,已经被移除了
      default:
        break
    }
    hiddenToolBox()
    updateComponenDataList(tempList)
  }

  // 观察 sider 由于折叠 产生的DOM变化 ，重新 计算宽度位置
  React.useEffect(() => {
    const asiderElement = document.querySelector(`.${ARCO_LAYOUT_SIDER_CLASS}`)

    const observer = new MutationObserver(() => {
      toolBoxRef.current?.updateStyle()
    })
    // asider 监听 width(attributes 属性) 变化
    if (asiderElement) observer.observe(asiderElement, { attributes: true })
    // 停止 观察
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    toolBoxRef,
    hiddenToolBox,
    handleOprateBtnClick,
  }
}
