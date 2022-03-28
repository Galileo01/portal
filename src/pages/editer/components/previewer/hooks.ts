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
} from '@/common/utils/element'
import { getComponentDataIndexFromElement } from '@/common/utils/component-data'
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
  componenDataList: ComponentDataList
  updateComponenDataList: (componenDataList: ComponentDataList) => void
}

// 处理拖拽 逻辑
export const useDragAndDrop = (params: useDragAndDropParams) => {
  const { previewerElementRef, componenDataList, updateComponenDataList } =
    params

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
  // RCR: RCRendered
  const handleRCRDragStart: React.DragEventHandler<HTMLElement> = (e) => {
    devLogger('handleRCRDragStart', e.target)
    currentDragingRCRRef.current = e.target as HTMLElement
  }

  /**
   * drop 放置 事件需要处理的任务
   * 1. 根据 key 构建 ComponentDataItem
   * 2. 更新 store 存储的 componenDataList ，会触发 快照的新建
   *
   */
  const handleDrop: React.DragEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // FIXME: 内部元素 也是可拖拽的 ，拖放事件 可能来源于 previewer 已存在的 子元素 即 e.dataTransfer 为空的情况
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
      devLogger('componentKey undefined')
      const preIndex = getComponentDataIndexFromElement(
        componenDataList,
        currentDragingRCRRef.current
      )
      // 截取/删除 并返回
      // eslint-disable-next-line prefer-destructuring
      insertComponentDataItem = componenDataList.splice(preIndex, 1)[0]
    }

    const insertIndex = getComponentDataIndexFromElement(
      componenDataList,
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
    componenDataList.splice(
      insertIndex > -1 ? insertIndex : componenDataList.length,
      0,
      insertComponentDataItem as ComponentDataItem
    )

    updateComponenDataList(componenDataList)
    removePlaceHolder()
    currentDragingRCRRef.current = null
  }

  const insertPlaceHolderThrottled = React.useMemo(
    () =>
      throttle<(target: HTMLElement) => void>(
        (target) => {
          if (!previewerElementRef.current || !placeHolderElementRef.current)
            return
          const isPreviewer = isPreviewerElement(target)

          devLogger(
            'insertPlaceHolderThrottled',
            'isPreviewer',
            isPreviewer,
            target
          )

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
    [previewerElementRef]
  )

  const handleDragOver: React.DragEventHandler<HTMLElement> = (e) => {
    insertPlaceHolderThrottled(e.target as HTMLElement)

    // NOTE:需要 在 dragover 事件  preventDefault 才能正常触发 drop事件
    // preventDefault 不能放入 throttle 中 ，否则 无法触发 drop 事件
    e.preventDefault()
  }

  React.useEffect(() => {
    placeHolderElementRef.current = createPlaceHolder()
  }, [])

  return {
    handleDragLeave: removePlaceHolder,
    handleDrop,
    handleDragOver,
    handleRCRDragStart,
  }
}

export type useToolBoxParams = Pick<
  useDragAndDropParams,
  'componenDataList' | 'updateComponenDataList'
>

// 处理  ToolBox 的 控制 逻辑
export const useToolBox = (params: useToolBoxParams) => {
  const { componenDataList, updateComponenDataList } = params

  const toolBoxRef = React.useRef<ToolBoxRef>(null)
  const [clickTarget, setClickTarget] = React.useState<HTMLElement>()

  const handlePreviewerClick: React.MouseEventHandler<HTMLElement> = (e) => {
    // NOTE:阻止 事件 继续传递  和 浏览器 的默认行为
    // e.stopPropagation()
    e.preventDefault()
    setClickTarget(e.target as HTMLElement)
  }

  const hiddenToolBox = () => {
    devLogger('hiddenToolBox')
    setClickTarget(undefined)
  }

  const handleOprateBtnClick: ToolBoxProps['onOprateBtnClick'] = (
    opratetype
  ) => {
    const tempList = [...componenDataList]
    const preIndex = getComponentDataIndexFromElement(
      tempList,
      clickTarget! // 强制 排除 null
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
        if (preIndex === componenDataList.length - 1) return
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
      devLogger('MutationObserver')
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
    clickTarget,
    hiddenToolBox,
    handlePreviewerClick,
    handleOprateBtnClick,
  }
}
