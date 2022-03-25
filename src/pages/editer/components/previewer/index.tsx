import * as React from 'react'

import { nanoid } from 'nanoid'

import { devLogger } from '@/common/utils'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { componentsList } from '@/resource-components'
import { DATASET_KEY_COMPONENT_KEY } from '@/common/constant'
import { ComponentDataItem } from '@/typings/editer'

import styles from './index.module.less'

const Previewer = () => {
  const { componenDataList, snapshotList, currentSnapshotIndex } =
    useEditerDataStore()
  const editDataDispatch = useEditerDataDispatch()

  /**
   * drop 放置 事件需要处理的任务
   * 1. 根据 key 构建 ComponentDataItem
   * 2. 更新 store 存储的 componenDataList ，会触发 快照的新建
   *
   */
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const componentKey = e.dataTransfer.getData(DATASET_KEY_COMPONENT_KEY)

    const targetComponent = componentsList.find(
      (component) => component.key === componentKey
    )
    const newComponentDataItem: ComponentDataItem = {
      id: `${componentKey}_${nanoid(10)}`,
      resourceComponent: targetComponent!!, // 排除 nullable 情况
    }

    devLogger('handleDrop', e.target, componentKey, newComponentDataItem)

    editDataDispatch({
      type: EditerDataActionEnum.SET_COMPONENT_DATA_LIST,
      payload: [...componenDataList, newComponentDataItem],
    })
  }

  devLogger('Previewer', componenDataList, snapshotList, currentSnapshotIndex)

  // 需要 在 dragover 事件  preventDefault 才能正常触发 drop事件
  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className={styles.previewer}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {componenDataList.map((component) => {
        const { id, resourceComponent } = component
        return (
          <resourceComponent.component
            key={id}
            {...resourceComponent.initProps}
          >
            {component.id}
          </resourceComponent.component>
        )
      })}
    </div>
  )
}

export default Previewer
