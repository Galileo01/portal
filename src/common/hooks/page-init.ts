import * as React from 'react'

import { FontList, ResourceType } from '@/typings/database'
import { PageConfig, ComponentDataList } from '@/typings/common/editer'
import { devLogger, safeJsonParse } from '@/common/utils'
import { getPageConfigById } from '@/common/utils/storage'
import { generateStyleNodeFromConfig } from '@/common/utils/style-config'
import { setColorVariableValue } from '@/common/utils/color-variable'
import { updateFontConfigToElement } from '@/common/utils/font'
import {
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { useFetchDataDispatch, FetchDataActionEnum } from '@/store/fetch-data'
import { getFontList } from '@/network/font'
import { getResourceById } from '@/network/resource'

export type InitType = 'restore' | 'fetch'

export type usePageInitParams = {
  resourceId: string | null
  resourceType: string
  initType: InitType
  /**
   * @isEditer : 是否是编辑器 页面 , 编辑器 更新 store
   * @true : 会将 config 全量更新到 context store
   * @false : 会更新 将 config.componentDataList 更新到 返回的 componentDataList
   */
  isEditer: boolean
}

const getConfig: (params: {
  resourceId: string
  initType: InitType
  resourceType: string
}) => Promise<
  Partial<{
    config: PageConfig
    fontList: FontList
  }>
> = (params) =>
  new Promise((resolve) => {
    const { resourceId, initType, resourceType } = params
    if (initType === 'restore') {
      getFontList().then((res) => {
        resolve({
          config: getPageConfigById(resourceId),
          fontList: res.success ? res.data : [],
        })
      })
    } else {
      // 发送 并发 请求
      Promise.all([
        getResourceById({
          resourceId,
          resourceType: resourceType as ResourceType,
        }),
        getFontList(),
      ]).then((res) => {
        const [resourceRes, fontListRes] = res
        resolve({
          config: resourceRes.success
            ? safeJsonParse(resourceRes.data.config)
            : undefined,
          fontList: fontListRes.success ? fontListRes.data : [],
        })
      })
    }
  })

export const usePageInit = (paramas: usePageInitParams) => {
  const { resourceId, initType, resourceType, isEditer } = paramas
  devLogger('usePageInit params', paramas)

  const editerDispatch = useEditerDataDispatch()
  const fetchDataDispatch = useFetchDataDispatch()

  const [componentDataList, setDataList] = React.useState<ComponentDataList>([])
  const [pageTitle, setTitle] = React.useState('')

  const pageInit = React.useCallback(() => {
    if (!resourceId) {
      throw new Error('pageid not valid')
    }

    getConfig({
      resourceId,
      initType,
      resourceType,
    }).then((res) => {
      const { config, fontList = [] } = res
      if (config) {
        if (isEditer) {
          const snapshotList = [config.componentDataList]
          // 恢复 store
          editerDispatch({
            type: EditerDataActionEnum.SET_STATE,
            payload: {
              ...config,
              snapshotList,
            },
          })
        } else {
          setDataList(config.componentDataList)
        }

        // 恢复 style node
        if (config.styleConfig) {
          generateStyleNodeFromConfig(config.styleConfig)
        }

        // 恢复主题配置
        if (config.globalConfig?.themeConfig) {
          setColorVariableValue(config.globalConfig?.themeConfig, isEditer)
        }
        // 恢复 字体
        if (config.globalConfig?.fontConfig) {
          updateFontConfigToElement(config.globalConfig?.fontConfig, fontList)
        }
      }
      setTitle(config?.title || resourceId)

      if (fontList.length > 0 && isEditer) {
        fetchDataDispatch({
          type: FetchDataActionEnum.SET_ALL_FONT_LIST,
          payload: fontList,
        })
      }
    })
  }, [
    resourceType,
    initType,
    isEditer,
    resourceId,
    editerDispatch,
    fetchDataDispatch,
  ])

  React.useEffect(() => {
    pageInit()
  }, [pageInit])

  return {
    componentDataList,
    pageTitle,
  }
}
