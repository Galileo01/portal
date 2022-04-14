import * as React from 'react'

import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { GlobalConfig } from '@/typings/common/editer'

export const useGlobalConfig = () => {
  const { globalConfig } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const updateGlobalConfig = React.useCallback(
    (lastConfig: GlobalConfig) => {
      editerDataDispatch({
        type: EditerDataActionEnum.UPDATE_GLOBAL_CONFIG,
        payload: lastConfig,
      })
    },
    [editerDataDispatch]
  )

  return {
    configData: globalConfig,
    updateGlobalConfig,
  }
}

export default useGlobalConfig
