import * as React from 'react'

import { Collapse } from '@arco-design/web-react'

import { ComponentDataItem } from '@/typings/editer'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { devLogger } from '@/common/utils'
import {
  isPreviewerElement,
  getComponentDataIndexFromElement,
  isRCRenderedElement,
} from '@/common/utils/element'

import styles from './index.module.less'
import PageConfig from './components/page-config'
import StyleConfig from './components/style-config'
import PropConfig, { PropConfigProps } from './components/props-config'

const Prop = () => {
  const { currentClickElement, componentDataList } = useEditerDataStore()
  const editerDispatch = useEditerDataDispatch()

  const [componentData, setComponentData] = React.useState<ComponentDataItem>()
  const componentDataIndexRef = React.useRef(-1)

  const [isPreviwer, setIsPreviewer] = React.useState(true)

  const isComponentDataValid = Boolean(componentData)

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

  // 更新 componentData  isPreviwer
  React.useEffect(() => {
    if (currentClickElement && isRCRenderedElement(currentClickElement)) {
      const index = getComponentDataIndexFromElement(
        componentDataList,
        currentClickElement
      )
      componentDataIndexRef.current = index
      setComponentData(componentDataList[index])
    } else {
      setComponentData(undefined)
    }
    setIsPreviewer(
      currentClickElement ? isPreviewerElement(currentClickElement) : true
    )
  }, [currentClickElement, componentDataList])

  devLogger('Prop', 'currentClickElement', currentClickElement)

  return (
    <div className={styles.prop}>
      <Collapse lazyload bordered={false} expandIconPosition="right">
        {isComponentDataValid && (
          <div className={styles.component_info}>
            <div>组件 : {componentData?.resourceComponent.name}</div>
          </div>
        )}
        {isPreviwer && <PageConfig />}
        {isComponentDataValid && (
          <PropConfig
            componentData={componentData}
            updateComponentProps={updateComponentProps}
          />
        )}
        <StyleConfig />
      </Collapse>
    </div>
  )
}

export default Prop
