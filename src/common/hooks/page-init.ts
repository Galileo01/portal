import * as React from 'react'

import { FontList, ResourceType } from '@/typings/database'
import { PageConfig, ComponentDataList } from '@/typings/common/editer'
import { devLogger, safeJsonParse } from '@/common/utils'
import { getPageConfigById } from '@/common/utils/storage'
import { generateStyleNodeFromConfig } from '@/common/utils/style-config'
import { setColorVariableValue } from '@/common/utils/color-variable'
import { updateFontConfigToDOM } from '@/common/utils/font'
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

// 应用配置数据 到dom上
export const applyConfigToDOM = (
  config: PageConfig,
  fontList: FontList,
  isEditer = false
) => {
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
    const { fontConfig } = config.globalConfig
    const usedFontName = fontConfig.usedFont?.map((item) => item[1]) || []
    const usedFont = fontList.filter(
      (font) => font.src && usedFontName.includes(font.name)
    )
    updateFontConfigToDOM(fontConfig.globalFont?.[1], usedFont, isEditer)
  }
}

export const usePageInit = (paramas: usePageInitParams) => {
  const { resourceId, initType, resourceType, isEditer } = paramas
  devLogger('usePageInit params', paramas)

  const editerDataDispatch = useEditerDataDispatch()
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
      devLogger('getConfig', config)

      if (config) {
        const {
          globalConfig,
          componentDataList: componentDataListInConfig,
          styleConfig,
        } = config
        if (isEditer) {
          // 恢复 store
          editerDataDispatch({
            type: EditerDataActionEnum.SET_STATE,
            payload: {
              componentDataList: componentDataListInConfig,
              globalConfig,
              styleConfig,
              snapshotList: [componentDataListInConfig],
            },
          })
        } else {
          setDataList(componentDataListInConfig)
        }
        applyConfigToDOM(config, fontList, isEditer)
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
    editerDataDispatch,
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
