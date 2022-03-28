import * as React from 'react'

import { cloneDeep } from 'lodash-es'

import { EditerData, ComponentDataList } from '@/typings/editer'
import { devLogger } from '@/common/utils'

type Store = EditerData

type Action = {
  type: EditerDataActionEnum
  payload?: Store | ComponentDataList
}

export enum EditerDataActionEnum {
  SET_STATE = 'setState',
  SET_CURRENT_INDEX = 'setCurrentIndex',
  SET_COMPONENT_DATA_LIST = 'setComponentDataList',
  BACK = 'back',
  FORWARD = 'forward',
}

// 快照列表 的最大长度
export const MAX_LENGTH = 5

const initStore: Store = {
  snapshotList: [[]], // 初始存在一个空的 快照
  currentSnapshotIndex: 0,
  componenDataList: [],
}

const EditerDataContext = React.createContext<Store>(initStore)
const EditerDataDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const { currentSnapshotIndex: preIndex, snapshotList } = state
  const { type, payload } = action

  devLogger(
    'reducer of  editer-data :',
    'preIndex',
    preIndex,
    'snapshotList',
    snapshotList,
    type,
    'type',
    'payload',
    payload
  )

  let newIndex = preIndex
  let newSnapshotList = []
  let newComponentDataList = []
  let spliceStart = 0
  switch (type) {
    // 全量更新
    case EditerDataActionEnum.SET_STATE:
      return {
        ...state,
        ...(payload as Store),
      }
    // 后退 - 下标 减小
    case EditerDataActionEnum.BACK:
      newIndex = preIndex - 1
      return {
        ...state,
        currentSnapshotIndex: newIndex,
        componenDataList: snapshotList[newIndex],
      }
    // 前进 - 下标 增大
    case EditerDataActionEnum.FORWARD:
      newIndex = preIndex + 1
      return {
        ...state,
        currentSnapshotIndex: newIndex,
        componenDataList: snapshotList[newIndex],
      }
    /**
     * 当 componenDataList 组件列表发生变化  需要进行的操作：
     * 1.更新 componenDataList
     * 2.创建 新的快照
     */
    case EditerDataActionEnum.SET_COMPONENT_DATA_LIST:
      newComponentDataList = payload as ComponentDataList
      // 剔除 preIndex 之后的  快照 ，保证 在后退 过程中 快照的创建 不出问题
      newSnapshotList = cloneDeep(
        snapshotList.slice(0, preIndex + 1).concat([newComponentDataList])
      )

      spliceStart = newSnapshotList.length - MAX_LENGTH

      // 长度进行 裁剪  最多 保留 倒数 MAX_LENGTH 个 快照
      newSnapshotList = newSnapshotList.slice(
        spliceStart >= 0 ? spliceStart : 0
      )
      return {
        snapshotList: newSnapshotList,
        currentSnapshotIndex: newSnapshotList.length - 1,
        componenDataList: newComponentDataList,
      }
    default:
      return {
        ...state,
      }
  }
}

export const EditerDataProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initStore)
  return (
    <EditerDataContext.Provider value={state}>
      <EditerDataDispatchContext.Provider value={dispatch}>
        {children}
      </EditerDataDispatchContext.Provider>
    </EditerDataContext.Provider>
  )
}

export const useEditerDataStore = () => React.useContext(EditerDataContext)
export const useEditerDataDispatch = () =>
  React.useContext(EditerDataDispatchContext)
