import * as React from 'react'

import { cloneDeep } from 'lodash-es'

import {
  EditerData,
  ComponentDataList,
  ComponentDataItem,
} from '@/typings/common/editer'
import { GlobalConfig, StyleConfig } from '@/typings/common/editer-config-data'
import { devLogger } from '@/common/utils'

type Store = EditerData

export enum EditerDataActionEnum {
  BACK = 'back',
  FORWARD = 'forward',
  SET_STATE = 'setState',
  SET_COMPONENT_DATA_LIST = 'setComponentDataList',
  SET_CURRENT_CLICK_ELEMENT = 'setCurrentClickElement',
  UPDATE_COMPONENT_DATA_ITEM = 'updateComponentDataItem',
  UPDATE_GLOBAL_CONFIG = 'updateGlobalConfig',
  UPDATE_STYLE_CONFIG = 'updateStyleConfig',
  CLEAR = 'clear',
}

export type ActionPayloadMap = {
  [EditerDataActionEnum.BACK]: undefined
  [EditerDataActionEnum.FORWARD]: undefined
  [EditerDataActionEnum.SET_STATE]: Partial<Store>
  [EditerDataActionEnum.SET_COMPONENT_DATA_LIST]: ComponentDataList
  [EditerDataActionEnum.SET_CURRENT_CLICK_ELEMENT]: HTMLElement
  [EditerDataActionEnum.UPDATE_COMPONENT_DATA_ITEM]: {
    index: number
    newData: ComponentDataItem
  }
  [EditerDataActionEnum.UPDATE_GLOBAL_CONFIG]: GlobalConfig
  [EditerDataActionEnum.UPDATE_STYLE_CONFIG]: StyleConfig
  [EditerDataActionEnum.CLEAR]: undefined
}

type Action = {
  type: EditerDataActionEnum
  payload?: ActionPayloadMap[Action['type']]
}

// 快照列表 的最大长度
export const MAX_LENGTH = 5

const initStore: Store = {
  snapshotList: [[]], // 初始存在一个空的 快照
  currentSnapshotIndex: 0,
  componentDataList: [],
  currentClickElement: undefined,
  globalConfig: undefined,
  styleConfig: [],
}

const EditerDataContext = React.createContext<Store>(initStore)
const EditerDataDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const {
    currentSnapshotIndex: preIndex,
    snapshotList,
    componentDataList,
    globalConfig,
  } = state
  const { type, payload } = action

  devLogger('reducer of  editer-data :', 'action', action)

  let newIndex = preIndex
  let newSnapshotList = []
  let newComponentDataList = []
  let spliceStart = 0
  let updateIndex = -1

  switch (type) {
    // 全量更新
    case EditerDataActionEnum.SET_STATE:
      return {
        ...state,
        ...(payload as Partial<Store>),
      }
    // 后退 - 下标 减小
    case EditerDataActionEnum.BACK:
      newIndex = preIndex - 1
      return {
        ...state,
        currentSnapshotIndex: newIndex,
        componentDataList: snapshotList[newIndex],
      }
    // 前进 - 下标 增大
    case EditerDataActionEnum.FORWARD:
      newIndex = preIndex + 1
      return {
        ...state,
        currentSnapshotIndex: newIndex,
        componentDataList: snapshotList[newIndex],
      }
    /**
     * 当 componentDataList 组件列表发生变化  需要进行的操作：
     * 1.更新 componentDataList
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
        ...state,
        snapshotList: newSnapshotList,
        currentSnapshotIndex: newSnapshotList.length - 1,
        componentDataList: newComponentDataList,
      }
    // 更新currentClickElement
    case EditerDataActionEnum.SET_CURRENT_CLICK_ELEMENT:
      return {
        ...state,
        currentClickElement: payload as HTMLElement,
      }
    // 更新 componentDataList 某一项 ，并不创建快照
    case EditerDataActionEnum.UPDATE_COMPONENT_DATA_ITEM:
      updateIndex = (payload as ActionPayloadMap['updateComponentDataItem'])
        .index
      componentDataList[updateIndex] = (
        payload as ActionPayloadMap['updateComponentDataItem']
      ).newData
      return {
        ...state,
        componentDataList,
      }
    // 更新页面配置
    case EditerDataActionEnum.UPDATE_GLOBAL_CONFIG:
      return {
        ...state,
        globalConfig: {
          ...globalConfig,
          ...payload,
        },
      }
    // 更新 样式配置
    case EditerDataActionEnum.UPDATE_STYLE_CONFIG:
      return {
        ...state,
        styleConfig: payload as StyleConfig,
      }
    // 清空 所有
    case EditerDataActionEnum.CLEAR:
      return initStore
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
