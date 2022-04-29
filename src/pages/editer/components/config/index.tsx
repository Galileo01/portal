import * as React from 'react'

import { Collapse, CollapseProps } from '@arco-design/web-react'

import { ComponentDataItem } from '@/typings/common/editer'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import {
  isPreviewerElement,
  getClosedRCRenderedElement,
  getComponentDataIndexFromID,
} from '@/common/utils/element'

import styles from './index.module.less'
import GlobalConfig from './components/global-config'
import StyleConfig from './components/style-config'
import PropConfig, { PropConfigProps } from './components/props-config'
import ClickElementInfo from './components/click-element-info'
import { ConfigPaneNameEnum, COLLAPSE_BASE_PROPS } from './config'
import { devLogger } from '@/common/utils'

const Config = () => {
  const { currentClickElement, componentDataList } = useEditerDataStore()
  const editerDispatch = useEditerDataDispatch()

  const [componentData, setComponentData] = React.useState<ComponentDataItem>()
  const componentDataIndexRef = React.useRef(-1)
  const [isPreviwer, setIsPreviewer] = React.useState(true)
  const [isRCComponent, setIsRCComponent] = React.useState(false)

  const [activeKey, setActiveKey] = React.useState('')
  const activeKeyRef = React.useRef('') // 使用ref 存储 ，防止 userEffect 重复触发

  const preClosedRCRElement = React.useRef<HTMLElement | undefined>(undefined)

  const currentClickElementValid = Boolean(currentClickElement)

  // 更新 componentData  isPreviwer isRCComponent
  const refreshState = React.useCallback(() => {
    // feature 辅助选中-向上查找 最近的 RCR 元素
    const closedRCRElement = currentClickElement
      ? getClosedRCRenderedElement(currentClickElement)
      : undefined

    devLogger('closedRCRElement', closedRCRElement)
    if (currentClickElement && closedRCRElement) {
      preClosedRCRElement.current = closedRCRElement
      const index = getComponentDataIndexFromID(
        componentDataList,
        closedRCRElement.id
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

  const handleElementReset = () => {
    editerDispatch({
      type: EditerDataActionEnum.SET_CURRENT_CLICK_ELEMENT,
      payload: undefined,
    })
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
    // 上一次 计算的 closedRCRElement 依然是 最新 currentClickElement 的祖先  不重新计算
    if (
      preClosedRCRElement.current &&
      currentClickElement &&
      preClosedRCRElement.current.contains(currentClickElement)
    ) {
      return
    }
    refreshState()
  }, [currentClickElement, refreshState])

  return (
    <div className={styles.config}>
      <Collapse
        {...COLLAPSE_BASE_PROPS}
        activeKey={activeKey}
        onChange={handleCollpaseChange}
      >
        <ClickElementInfo
          currentClickElement={currentClickElement}
          isPreviwer={isPreviwer}
          RCComponentName={componentData?.resourceComponent.name}
          onReset={handleElementReset}
        />
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
