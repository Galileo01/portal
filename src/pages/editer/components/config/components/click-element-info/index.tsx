import * as React from 'react'

import { Tooltip, Button, Message } from '@arco-design/web-react'
import {
  IconRefresh,
  IconQuestionCircle,
  IconCopy,
} from '@arco-design/web-react/icon'

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
    if (isRCComponent) return `组件 - ${RCComponentName}`
    if (isPreviwer) return '全局配置'
    if (currentClickElement)
      return `元素 - ${currentClickElement.tagName.toLowerCase()}`
    return ''
  }, [isPreviwer, isRCComponent, currentClickElement, RCComponentName])

  const handleCopyClick = () => {
    if (currentClickElement?.id)
      navigator.clipboard.writeText(currentClickElement?.id).then(() => {
        Message.success('复制成功')
      })
  }

  return (
    <div className={styles.element_info}>
      <div className={styles.info_wrapper}>
        <div>
          <div className={styles.label}>当前选中:</div>
          <div>
            <span className={styles.label}>类型:</span>
            <span className={styles.info_text}>{infoText}</span>
          </div>
          <div>
            <span className={styles.label}>
              id
              <Tooltip content="元素id,可填入侧边导航等组件中跳转">
                <IconQuestionCircle className="question_icon" />
              </Tooltip>
              :
            </span>
            <span className={styles.info_text}>{currentClickElement?.id}</span>
            {currentClickElement?.id && (
              <IconCopy className="question_icon" onClick={handleCopyClick} />
            )}
          </div>
        </div>
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
