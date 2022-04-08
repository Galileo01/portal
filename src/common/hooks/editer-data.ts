import * as React from 'react'

import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { GlobalConfig } from '@/typings/common/editer'

export const useGlobalConfig = (config: 'theme' | 'font') => {
  const { globalConfig } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const updateGlobalConfig = React.useCallback(
    (lastConfig: GlobalConfig) => {
      editerDataDispatch({
        type: EditerDataActionEnum.UPDATE_GLOBALCONFIG,
        payload: lastConfig,
      })
    },
    [editerDataDispatch]
  )

  return {
    configData:
      config === 'font' ? globalConfig?.fontConfig : globalConfig?.themeConfig,
    updateGlobalConfig,
  }
}

export default useGlobalConfig
