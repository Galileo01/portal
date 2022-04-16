import * as React from 'react'

import { Tooltip, Button } from '@arco-design/web-react'
import { IconRefresh } from '@arco-design/web-react/icon'

import styles from './index.module.less'

export type ClickElementInfoProps = {
  currentClickElement?: HTMLElement
  RCComponentName?: string
  isPreviwer: boolean
  isRCComponent: boolean
  onReset: () => void
}

const ClickElementInfo: React.FC<ClickElementInfoProps> = (props) => {
  const {
    isPreviwer,
    isRCComponent,
    onReset,
    currentClickElement,
    RCComponentName,
  } = props

  const infoText = React.useMemo(() => {
    if (isRCComponent) return `组件- ${RCComponentName}`
    if (isPreviwer) return '全局配置'
    if (currentClickElement)
      return `元素- ${currentClickElement.tagName.toLowerCase()}`
    return ''
  }, [isPreviwer, isRCComponent, currentClickElement, RCComponentName])

  return (
    <div className={styles.element_info}>
      <div className={styles.info_wrapper}>
        <span>
          <span className={styles.label}>当前选中:</span>
          <span className={styles.info_text}>{infoText}</span>
        </span>
        <Tooltip content="重置当前选中">
          <Button
            size="mini"
            shape="circle"
            type="primary"
            icon={<IconRefresh />}
            onClick={onReset}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default ClickElementInfo
