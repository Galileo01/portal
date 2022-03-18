import * as React from 'react'

import { EditerData } from '@/typings/editer'

type Store = EditerData

type Action = {
  type: EditerDataActionEnum.SET_STATE
  payload: Store
}

export enum EditerDataActionEnum {
  SET_STATE = 'setState',
}

const initStore: Store = {
  componentTree: [],
}

const EditerDataContext = React.createContext<Store>(initStore)
const EditerDataDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case EditerDataActionEnum.SET_STATE:
      return {
        ...state,
        ...payload,
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
export const useEditDataDispatch = () =>
  React.useContext(EditerDataDispatchContext)
