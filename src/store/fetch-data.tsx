import * as React from 'react'

import { FontList, Resource } from '@/typings/database'

import { devLogger } from '@/common/utils'

type Store = {
  allFontList: FontList
  resource?: Resource
}

export enum FetchDataActionEnum {
  SET_STATE = 'setState',
  SET_ALL_FONT_LIST = 'setAllFontList',
  SET_RESOURCE = 'setResource',
}

export type FetchDataPayloadMap = {
  [FetchDataActionEnum.SET_STATE]: Store
  [FetchDataActionEnum.SET_ALL_FONT_LIST]: FontList
  [FetchDataActionEnum.SET_RESOURCE]: Resource
}

type Action = {
  type: FetchDataActionEnum
  payload?: FetchDataPayloadMap[Action['type']]
}

const initStore: Store = {
  allFontList: [],
}

const FetchDataContext = React.createContext<Store>(initStore)
const FetchDataDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const { type, payload } = action

  devLogger('reducer of fecth-data', 'action', action)

  switch (type) {
    case FetchDataActionEnum.SET_STATE:
      return {
        ...state,
        ...(payload as Store),
      }

    case FetchDataActionEnum.SET_ALL_FONT_LIST:
      return {
        ...state,
        allFontList: payload as FetchDataPayloadMap['setAllFontList'],
      }
    case FetchDataActionEnum.SET_RESOURCE:
      return {
        ...state,
        resource: payload as Resource,
      }
    default:
      return {
        ...state,
      }
  }
}

export const FetchDataProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initStore)

  return (
    <FetchDataContext.Provider value={state}>
      <FetchDataDispatchContext.Provider value={dispatch}>
        {children}
      </FetchDataDispatchContext.Provider>
    </FetchDataContext.Provider>
  )
}

export const useFetchDataStore = () => React.useContext(FetchDataContext)

export const useFetchDataDispatch = () =>
  React.useContext(FetchDataDispatchContext)
