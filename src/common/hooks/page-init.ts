import * as React from 'react'

import { FontList } from '@/typings/network'

import { PageConfig, ComponentDataList } from '@/typings/common/editer'
import { devLogger } from '@/common/utils'
import { getPageConfigById } from '@/common/utils/storage'
import { generateStyleNodeFromConfig } from '@/common/utils/style-config'
import { setColorVariableValue } from '@/common/utils/color-variable'
import { updateFontConfigToElement } from '@/common/utils/font'
import { fontList as mockFontList } from '@/mock/fontList'
import {
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { useFetchDataDispatch, FetchDataActionEnum } from '@/store/fetch-data'

export type InitType = 'restore' | 'fetch'

export type usePageInitParams = {
  pageId: string | null
  initType: InitType
  /**
   * @isEditer : 是否是编辑器 页面 , 编辑器 更新 store
   * @true : 会将 config 全量更新到 context store
   * @false : 会更新 将 config.componentDataList 更新到 返回的 componentDataList
   */
  isEditer: boolean
}

const getConfig: (params: { pageId: string; initType: InitType }) => Promise<
  Partial<{
    config: PageConfig
    fontList: FontList
  }>
> = (params) =>
  new Promise((resolve) => {
    const { pageId, initType } = params
    if (initType === 'restore') {
      resolve({
        config: getPageConfigById(pageId),
        fontList: mockFontList,
      })
    } else {
      // 发送请求
      // config = fetch
      resolve({})
    }
  })

export const usePageInit = (paramas: usePageInitParams) => {
  const { pageId, initType, isEditer } = paramas

  const editerDispatch = useEditerDataDispatch()
  const fetchDataDispatch = useFetchDataDispatch()

  const [componentDataList, setDataList] = React.useState<ComponentDataList>([])
  const [pageTitle, setTitle] = React.useState('')

  const pageInit = React.useCallback(() => {
    devLogger('usePage call', pageId, initType, isEditer)
    if (!pageId) {
      throw new Error('pageid not valid')
    }

    getConfig({
      pageId,
      initType,
    }).then((res) => {
      const { config, fontList = [] } = res
      devLogger(' usePage res get', res)
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
      setTitle(config?.title || pageId)

      if (fontList.length > 0 && isEditer) {
        fetchDataDispatch({
          type: FetchDataActionEnum.SET_ALL_FONT_LIST,
          payload: fontList,
        })
      }
    })
  }, [initType, isEditer, pageId, editerDispatch, fetchDataDispatch])

  React.useEffect(() => {
    pageInit()
  }, [pageInit])

  return {
    componentDataList,
    pageTitle,
  }
}
