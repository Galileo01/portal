import * as React from 'react'

import { useUserInfo } from '@/store/user-info'

export type HooksParams = {
  onRefresh: () => void
}

export const useRefreshWhenUserUpdate = (params: HooksParams) => {
  const { onRefresh } = params

  const userInfo = useUserInfo()
  const preUserInfoRef = React.useRef(userInfo)

  React.useEffect(() => {
    if (userInfo !== preUserInfoRef.current) {
      onRefresh()
      preUserInfoRef.current = userInfo
    }
  }, [userInfo, onRefresh])

  return {
    userInfo,
  }
}

export default useRefreshWhenUserUpdate
