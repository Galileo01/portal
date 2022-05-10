import * as React from 'react'

import { UserBase } from '@/typings/request'

import { devLogger } from '@/common/utils'

type Store = UserBase | undefined

export enum UserActionEnum {
  SET_STATE = 'setState',
  CLEAR = 'clear',
}

export type ActionPayloadMap = {
  [UserActionEnum.SET_STATE]: UserBase
  [UserActionEnum.CLEAR]: undefined
}

type Action = {
  type: UserActionEnum
  payload: ActionPayloadMap[Action['type']]
}

const initStore = undefined

const UserInfoContext = React.createContext<Store>(initStore)

const UserInfoDispatchContext = React.createContext<React.Dispatch<Action>>(
  () => initStore
)

const reducer: React.Reducer<Store, Action> = (state, action) => {
  const { type, payload } = action
  devLogger('reducer user-info ', type, payload)

  switch (type) {
    case UserActionEnum.SET_STATE:
      return payload as Store

    case UserActionEnum.CLEAR:
      return initStore

    default:
      return state
  }
}

export const UserInfoProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initStore)
  return (
    <UserInfoContext.Provider value={state}>
      <UserInfoDispatchContext.Provider value={dispatch}>
        {children}
      </UserInfoDispatchContext.Provider>
    </UserInfoContext.Provider>
  )
}

export const useUserInfo = () => React.useContext(UserInfoContext)

export const useUserInfoDispatch = () =>
  React.useContext(UserInfoDispatchContext)
