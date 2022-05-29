import * as React from 'react'

import { Tooltip, Button, Message } from '@arco-design/web-react'
import {
  IconRefresh,
  IconCopy,
  IconLocation,
} from '@arco-design/web-react/icon'

import HelpTip from '@/components/help-tip'

import styles from './index.module.less'

export type ClickElementInfoProps = {
  currentClickElement?: HTMLElement
  RCComponentName?: string
  isPreviwer: boolean
  onReset: () => void
  onHelpChoose: () => void
}

const ClickElementInfo: React.FC<ClickElementInfoProps> = (props) => {
  const {
    isPreviwer,
    currentClickElement,
    RCComponentName,
    onReset,
    onHelpChoose,
  } = props

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
      <div className={styles.click_info}>
        <div className={styles.label}>
          选中元素:
          <span className={styles.info_text}>{infoText}</span>
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
            <Tooltip content="复制id">
              <IconCopy className="question_icon" onClick={handleCopyClick} />
            </Tooltip>
          )}
        </div>
      </div>
      <div className={styles.fun_btns}>
        <Tooltip content="重置当前选中">
          <Button
            size="mini"
            shape="circle"
            type="primary"
            icon={<IconRefresh />}
            onClick={onReset}
          />
        </Tooltip>
        <Tooltip content="辅助选中源组件">
          <Button
            size="mini"
            shape="circle"
            type="outline"
            disabled={!currentClickElement}
            icon={<IconLocation />}
            onClick={onHelpChoose}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default ClickElementInfo
