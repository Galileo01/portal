import * as React from 'react'

import clsx from 'clsx'

import { devLogger } from '@/common/utils'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { PREVIEWER_CLASS, PREVIEWER_CONTAINER_CLASS } from '@/common/constant'
import { ComponentDataList } from '@/typings/editer'
import RCListRenderer from '@/components/rclist-renderer'

import ToolBox from './components/tool-box'
import { useDragAndDrop, useToolBox } from './hooks'
import styles from './index.module.less'

const Previewer = () => {
  const {
    componentDataList,
    snapshotList,
    currentSnapshotIndex,
    currentClickElement,
  } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const previewerElementRef = React.useRef<HTMLDivElement | null>(null)

  const updateComponenDataList = (newList: ComponentDataList) => {
    editerDataDispatch({
      type: EditerDataActionEnum.SET_COMPONENT_DATA_LIST,
      payload: [...newList],
    })
  }

  const updateClickElement = (newElement?: HTMLElement) => {
    editerDataDispatch({
      type: EditerDataActionEnum.SET_CURRENT_CLICK_ELEMENT,
      payload: newElement,
    })
  }

  const { toolBoxRef, hiddenToolBox, handleOprateBtnClick } = useToolBox({
    currentClickElement,
    updateClickElement,
    componentDataList,
    updateComponenDataList,
  })

  const { handleDragLeave, handleDrop, handleDragOver, handleRCRDragStart } =
    useDragAndDrop({
      previewerElementRef,
      componentDataList,
      updateComponenDataList,
      actionsBeforeHandle: hiddenToolBox,
    })

  const handleDragOverWrappered: React.DragEventHandler<HTMLElement> = (e) => {
    // 处理  DragOver 事件 之前 隐藏 toolbox
    handleDragOver(e.target as HTMLElement)
    // NOTE:需要 在 dragover 事件  preventDefault 才能正常触发 drop事件
    // preventDefault 不能放入 throttle 中 ，否则 无法触发 drop 事件
    e.preventDefault()
  }

  const handlePreviewerClick: React.DragEventHandler<HTMLDivElement> = (e) => {
    // 阻止 浏览器的 默认行为(a 标签等)
    e.preventDefault()
    updateClickElement(e.target as HTMLElement)
  }

  devLogger(
    'Previewer',
    'componentDataList = ',
    componentDataList,
    'snapshotList=',
    snapshotList,
    'currentSnapshotIndex =',
    currentSnapshotIndex
  )

  return (
    <section
      className={clsx(styles.previewer_container, PREVIEWER_CONTAINER_CLASS)}
    >
      <div
        className={clsx(styles.previewer, PREVIEWER_CLASS)}
        onDrop={handleDrop}
        onDragOver={handleDragOverWrappered}
        ref={previewerElementRef}
        onDragLeave={handleDragLeave}
        onClick={handlePreviewerClick}
      >
        <RCListRenderer
          RCList={componentDataList}
          onDragStart={handleRCRDragStart}
        />
      </div>
      <ToolBox
        toolBoxRef={toolBoxRef}
        targetElement={currentClickElement}
        onOprateBtnClick={handleOprateBtnClick}
      />
    </section>
  )
}

export default Previewer
