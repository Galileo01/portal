import * as React from 'react'

import { Tooltip, Button, Message } from '@arco-design/web-react'
import { IconRefresh, IconCopy } from '@arco-design/web-react/icon'

import HelpTip from '@/components/help-tip'

import styles from './index.module.less'

export type ClickElementInfoProps = {
  currentClickElement?: HTMLElement
  RCComponentName?: string
  isPreviwer: boolean
  onReset: () => void
}

// TODO:  4.25-2  展示组件列表

const ClickElementInfo: React.FC<ClickElementInfoProps> = (props) => {
  const { isPreviwer, onReset, currentClickElement, RCComponentName } = props

  const infoText = React.useMemo(() => {
    if (isPreviwer) return '全局配置'
    if (currentClickElement) return currentClickElement.tagName.toLowerCase()
    return ''
  }, [isPreviwer, currentClickElement])

  const handleCopyClick = () => {
    if (currentClickElement?.id)
      navigator.clipboard.writeText(currentClickElement?.id).then(() => {
        Message.success('复制成功')
      })
  }

  return (
    <div className={styles.element_info}>
      <div>
        <div className={styles.click_info}>
          <div className={styles.label}>
            选中元素:
            <span className={styles.info_text}>{infoText}</span>
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
        <div className={styles.label}>
          所属组件:
          <span className={styles.info_text}>{RCComponentName}</span>
        </div>
        <div>
          <span className={styles.label}>
            id
            <HelpTip content="元素id,可填入侧边导航等组件中跳转" />:
          </span>
          <span className={styles.info_text}>{currentClickElement?.id}</span>
          {currentClickElement?.id && (
            <IconCopy className="question_icon" onClick={handleCopyClick} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ClickElementInfo
