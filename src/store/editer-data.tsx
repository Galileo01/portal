import * as React from 'react'

import { cloneDeep } from 'lodash-es'

import { EditerData } from '@/typings/editer'

type Store = EditerData

type Action = {
  type: EditerDataActionEnum
  payload?: unknown
}

export enum EditerDataActionEnum {
  SET_STATE = 'setState',
  SET_CURRENT_INDEX = 'setCurrentIndex',
  CREATE = 'create',
  BACK = 'back',
  FORWARD = 'forward',
}

// 快照列表 的最大长度
const MAX_LENGTH = 5

const initStore: Store = {
  snapshotList: [[]], // 初始存在一个空的 快照
  currentSnapshotIndex: 0,
  componenList: [],
}

const EditerDataContext = React.createContext<Store>(initStore)
const EditerDataDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const { currentSnapshotIndex: preIndex, snapshotList, componenList } = state
  const { type, payload } = action
  let newIndex = preIndex
  let newList = []
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
        componenList: snapshotList[newIndex],
      }
    // 前进 - 下标 增大
    case EditerDataActionEnum.FORWARD:
      newIndex = preIndex + 1
      return {
        ...state,
        currentSnapshotIndex: newIndex,
        componenList: snapshotList[newIndex],
      }
    // 创建新的 快照
    case EditerDataActionEnum.CREATE:
      newIndex = preIndex + 1
      // 剔除 preIndex 之后的  快照 ，保证 在后退 过程中 快照的创建 不出问题
      newList = cloneDeep(
        snapshotList.slice(0, preIndex + 1).concat(componenList)
      )
      return {
        ...state,
        snapshotList: newList.slice(newList.length - MAX_LENGTH), // 最多 保留 倒数 MAX_LENGTH 个 快照
        currentSnapshotIndex: newIndex,
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
