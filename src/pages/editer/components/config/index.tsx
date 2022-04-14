import * as React from 'react'

import { Collapse, CollapseProps } from '@arco-design/web-react'

import { ComponentDataItem } from '@/typings/common/editer'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { useFetchDataDispatch, FetchDataActionEnum } from '@/store/fetch-data'
import { devLogger } from '@/common/utils'
import {
  isPreviewerElement,
  getComponentDataIndexFromElement,
  isRCRenderedElement,
} from '@/common/utils/element'
import { fontList } from '@/mock/fontList'

import styles from './index.module.less'
import GlobalConfig from './components/global-config'
import StyleConfig from './components/style-config'
import PropConfig, { PropConfigProps } from './components/props-config'
import { ConfigPaneNameEnum, COLLAPSE_BASE_PROPS } from './config'

const Config = () => {
  const { currentClickElement, componentDataList } = useEditerDataStore()
  const editerDispatch = useEditerDataDispatch()
  const fetchDataDispatch = useFetchDataDispatch()

  const [componentData, setComponentData] = React.useState<ComponentDataItem>()
  const componentDataIndexRef = React.useRef(-1)
  const [isPreviwer, setIsPreviewer] = React.useState(true)
  const [isRCComponent, setIsRCComponent] = React.useState(false)

  const [activeKey, setActiveKey] = React.useState('')
  const activeKeyRef = React.useRef('') // 使用ref 存储 ，防止 userEffect 重复触发

  const currentClickElementValid = Boolean(currentClickElement)

  // 更新 componentData  isPreviwer isRCComponent
  const refreshState = React.useCallback(() => {
    if (currentClickElement && isRCRenderedElement(currentClickElement)) {
      const index = getComponentDataIndexFromElement(
        componentDataList,
        currentClickElement
      )
      componentDataIndexRef.current = index
      setComponentData(componentDataList[index])
      setIsRCComponent(true)
    } else {
      setComponentData(undefined)
      setIsRCComponent(false)
    }
    // 更新 isPreviwer
    setIsPreviewer(
      currentClickElement ? isPreviewerElement(currentClickElement) : true
    )
  }, [currentClickElement, componentDataList])

  const updateComponentProps: PropConfigProps['updateComponentProps'] = (
    props
  ) => {
    const { resourceComponent, id } = componentData!
    devLogger('updateComponentProps', 'id', id, 'newprops', props)
    // 更props 的更新不能  触发 新快照的  创建
    editerDispatch({
      type: EditerDataActionEnum.UPDATE_COMPONENT_DATA_ITEM,
      payload: {
        index: componentDataIndexRef.current,
        newData: {
          id,
          resourceComponent: {
            ...resourceComponent,
            props,
          },
        },
      },
    })
  }

  const handleCollpaseChange: CollapseProps['onChange'] = (name) => {
    // 相同 关闭
    const lastedKey = name === activeKeyRef.current ? '' : name
    setActiveKey(lastedKey)
    activeKeyRef.current = lastedKey
  }

  // 手动折叠
  React.useEffect(() => {
    if (
      activeKeyRef.current === ConfigPaneNameEnum.GLOBAL_CONFIG &&
      !isPreviwer
    ) {
      setActiveKey('')
    }
    if (
      activeKeyRef.current === ConfigPaneNameEnum.PROPS_CONFIG &&
      !isRCComponent
    ) {
      setActiveKey('')
    }
  }, [isPreviwer, isRCComponent])

  React.useEffect(() => {
    refreshState()
  }, [refreshState])

  // 模拟 网络请求- 字体列表
  React.useEffect(() => {
    fetchDataDispatch({
      type: FetchDataActionEnum.SET_ALL_FONT_LIST,
      payload: fontList,
    })
  }, [fetchDataDispatch])

  return (
    <div className={styles.config}>
      <Collapse
        {...COLLAPSE_BASE_PROPS}
        activeKey={activeKey}
        onChange={handleCollpaseChange}
      >
        {isRCComponent && (
          <div className={styles.component_info}>
            <div>组件 : {componentData?.resourceComponent.name}</div>
          </div>
        )}
        <GlobalConfig active={isPreviwer} />
        <PropConfig
          active={isRCComponent}
          componentData={componentData}
          updateComponentProps={updateComponentProps}
        />
        <StyleConfig active={currentClickElementValid} />
      </Collapse>
    </div>
  )
}

export default Config
