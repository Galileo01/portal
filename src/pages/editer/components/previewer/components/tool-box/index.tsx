import * as React from 'react'

import { Tooltip } from '@arco-design/web-react'
import {
  IconArrowUp,
  IconArrowDown,
  IconDelete,
} from '@arco-design/web-react/icon'

import { isPreviewerElement, isRCRenderedElement } from '@/common/utils/element'

import styles from './index.module.less'

export type ToolBoxRef = {
  updateStyle: () => void
}

export type OprateType = 'up_move' | 'down_move' | 'delete'

export type ToolBoxProps = {
  toolBoxRef: React.Ref<ToolBoxRef>
  targetElement?: HTMLElement
  onOprateBtnClick: (oprateType: OprateType) => void
}

export type Style = {
  width: number
  height: number
  left: number
  top: number
}

const calculateStyle: (target: HTMLElement) => Style = (target) => {
  const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = target
  return {
    width: offsetWidth,
    height: offsetHeight,
    left: offsetLeft,
    top: offsetTop,
  }
}

const ToolBox: React.FC<ToolBoxProps> = (props) => {
  const { targetElement, toolBoxRef, onOprateBtnClick } = props
  const [style, setStyle] = React.useState<Style>()
  const [btnVisible, setBtnVisible] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  const updateStyle = React.useCallback(() => {
    if (!targetElement) {
      setVisible(false)
      return
    }
    setStyle(calculateStyle(targetElement))
    // 非 previewer 情况下 展示
    setVisible(!isPreviewerElement(targetElement))
    // 满足  RCRendered  才展示 工具按钮
    setBtnVisible(isRCRenderedElement(targetElement))
  }, [targetElement])

  // 像 父组件 暴露 手动 更新的 方法
  React.useImperativeHandle(toolBoxRef, () => ({
    updateStyle,
  }))

  const handleUpMove = () => {
    onOprateBtnClick('up_move')
  }

  const handleDownMove = () => {
    onOprateBtnClick('down_move')
  }

  const handleDelete = () => {
    onOprateBtnClick('delete')
  }

  React.useEffect(() => {
    updateStyle()
  }, [updateStyle])

  if (!visible) return null

  return (
    <div className={styles.tool_box} style={style}>
      {btnVisible ? (
        <div className={styles.tool_btns}>
          <Tooltip content="上移" mini>
            <IconArrowUp onClick={handleUpMove} />
          </Tooltip>
          <Tooltip content="下移" mini>
            <IconArrowDown onClick={handleDownMove} />
          </Tooltip>
          <Tooltip content="删除" mini>
            <IconDelete onClick={handleDelete} />
          </Tooltip>
        </div>
      ) : null}
    </div>
  )
}

export default ToolBox
