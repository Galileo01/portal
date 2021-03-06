import * as React from 'react'

import { throttle } from 'lodash-es'
import { Modal, Message } from '@arco-design/web-react'

import {
  ComponentDataItem,
  ComponentDataList,
  PageConfig,
  EditerData,
} from '@/typings/common/editer'
import {
  DATASET_KEY_RESOURCE_COMPONENT_KEY,
  TEMPLATE_IMPORT_EVENT,
} from '@/common/constant'
import {
  devLogger,
  getUniqueId,
  safeJsonParse,
  createTimeoutPromise,
} from '@/common/utils'
import { TemplateImportEvent } from '@/typings/common/event'
import {
  isPreviewerElement,
  getClosedRCRenderedElement,
  getComponentDataIndexFromElement,
} from '@/common/utils/element'
import { RCList } from '@/resource-components'
import { getResourceById } from '@/network/resource'
import { applyConfigToDOM } from '@/common/hooks/resource-init'
import { transformToDataList } from '@/common/utils/prop-config'

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

// 处理源组件的拖拽渲染 以及 previewer 内部拖拽排序
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
    const newComponentDataList = [...componentDataList]
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
        newComponentDataList,
        currentDragingRCRRef.current
      )
      // 截取/删除 并返回
      // eslint-disable-next-line prefer-destructuring
      insertComponentDataItem = newComponentDataList.splice(preIndex, 1)[0]
    }

    const insertIndex = getComponentDataIndexFromElement(
      newComponentDataList,
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
      insertIndex,
      'insertComponentDataItem',
      insertComponentDataItem
    )

    // 插入 指定位置 或者末尾
    newComponentDataList.splice(
      insertIndex > -1 ? insertIndex : newComponentDataList.length,
      0,
      insertComponentDataItem as ComponentDataItem
    )

    updateComponenDataList(newComponentDataList)
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
          const RCRenderedElement = getClosedRCRenderedElement(target)
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

  return {
    toolBoxRef,
    hiddenToolBox,
    handleOprateBtnClick,
  }
}

// 处理模板导入 相关逻辑
export type useTemplateImportParmas = Pick<
  useDragAndDropParams,
  'componentDataList' | 'updateComponenDataList'
> & {
  updateEditerData: (editerData: Partial<EditerData>) => void
}

export const useTemplateImport = (params: useTemplateImportParmas) => {
  const { componentDataList, updateComponenDataList, updateEditerData } = params

  const handleImport = React.useCallback(
    (e) => {
      const {
        detail: { resourceId },
      } = e as TemplateImportEvent
      const modal = Modal.info({
        title: '提示',
        content: '正在拉取并导入模板数据...',
        footer: null,
        maskClosable: false,
      })

      // 保证 弹框展示至少2秒 ，使用 createTimeoutPromise创建延时
      Promise.all([
        getResourceById({
          resourceId,
          resourceType: 'template',
        }),
        createTimeoutPromise(2000),
      ]).then(([res]) => {
        if (res.success) {
          const config = safeJsonParse<PageConfig>(res.data.config)
          if (config) {
            const {
              globalConfig,
              componentDataList: componentDataListInConfig,
              styleConfig,
            } = config

            // 更新store
            updateEditerData({
              globalConfig,
              styleConfig,
            })

            // 应用配置数据
            applyConfigToDOM(config, [], true)
            // 模板的组件列表追加到后面
            updateComponenDataList(
              componentDataList.concat(
                transformToDataList(componentDataListInConfig)
              )
            )
            modal.close()
            Message.success('导入成功')
          }
        }
      })
    },
    [updateComponenDataList, updateEditerData, componentDataList]
  )

  React.useEffect(() => {
    window.addEventListener(TEMPLATE_IMPORT_EVENT, handleImport)

    return () => {
      window.removeEventListener(TEMPLATE_IMPORT_EVENT, handleImport)
    }
  }, [handleImport])
}
