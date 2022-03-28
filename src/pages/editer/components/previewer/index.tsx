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
  const { componenDataList, snapshotList, currentSnapshotIndex } =
    useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const previewerElementRef = React.useRef<HTMLDivElement | null>(null)

  const updateComponenDataList = (newList: ComponentDataList) => {
    editerDataDispatch({
      type: EditerDataActionEnum.SET_COMPONENT_DATA_LIST,
      payload: [...newList],
    })
  }

  const { handleDragLeave, handleDrop, handleDragOver, handleRCRDragStart } =
    useDragAndDrop({
      previewerElementRef,
      componenDataList,
      updateComponenDataList,
    })

  const {
    toolBoxRef,
    clickTarget,
    hiddenToolBox,
    handlePreviewerClick,
    handleOprateBtnClick,
  } = useToolBox({
    componenDataList,
    updateComponenDataList,
  })

  const handleDragOverWrappered: React.DragEventHandler<HTMLElement> = (e) => {
    // 处理  DragOver 事件 之前 隐藏 toolbox
    hiddenToolBox()
    handleDragOver(e)
  }

  const handleRCRDragStartWrappered: React.DragEventHandler<HTMLElement> = (
    e
  ) => {
    // 处理  DragStart 事件 之前 隐藏 toolbox
    hiddenToolBox()
    handleRCRDragStart(e)
  }

  devLogger(
    'Previewer',
    'componenDataList = ',
    componenDataList,
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
        onClickCapture={handlePreviewerClick}
      >
        <RCListRenderer
          RCList={componenDataList}
          onDragStart={handleRCRDragStartWrappered}
        />
      </div>
      <ToolBox
        toolBoxRef={toolBoxRef}
        targetElement={clickTarget}
        onOprateBtnClick={handleOprateBtnClick}
      />
    </section>
  )
}

export default Previewer
