import * as React from 'react'

import { Tooltip } from '@arco-design/web-react'
import {
  IconArrowUp,
  IconArrowDown,
  IconDelete,
} from '@arco-design/web-react/icon'

import { isPreviewerElement, isRCRenderedElement } from '@/common/utils/element'
import { devLogger } from '@/common/utils'
import {
  ARCO_LAYOUT_SIDER_CLASS,
  ARCO_LAYOUT_CONTENT_CLASS,
  RESOURCE_COMPONENT_WILL_STICKY_CLASS,
} from '@/common/constant'

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

const calculateStyle: (targetElement: HTMLElement) => Style = (
  targetElement
) => {
  const { offsetHeight, offsetLeft, offsetTop, offsetWidth } = targetElement
  return {
    width: offsetWidth,
    height: offsetHeight,
    left: offsetLeft,
    top: offsetTop,
  }
}

// 根据 目标元素， 判断是否要监听  ARCO_LAYOUT_CONTENT_CLASS 的滚动事件来 更新
const judgeShouldListenScroll: (targetElement: HTMLElement) => boolean = (
  targetElement
) => {
  // 1.类名 包含  RESOURCE_COMPONENT_WILL_STICKY_CLASS
  if (targetElement.classList.contains(RESOURCE_COMPONENT_WILL_STICKY_CLASS))
    return true

  // 2. position === 'sticky' 情况下需要监听
  if (getComputedStyle(targetElement).getPropertyValue('position') === 'sticky')
    return true

  return false
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
    devLogger('updateStyle', calculateStyle(targetElement))
    // 非 previewer 情况下 展示
    setVisible(!isPreviewerElement(targetElement))
    // 满足  RCRendered  才展示 工具按钮
    setBtnVisible(isRCRenderedElement(targetElement))
  }, [targetElement])

  // 像 父组件 暴露 手动 更新的 方法
  React.useImperativeHandle(
    toolBoxRef,
    () => ({
      updateStyle,
    }),
    [updateStyle]
  )

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

  // 观察 由于 propsconfig 更新引起的 dom变化 重新计算位置信息
  React.useEffect(() => {
    const observer = new MutationObserver(updateStyle)
    if (targetElement) {
      observer.observe(targetElement, {
        attributes: true,
        subtree: true, // 观察目标扩展到 子树上
        childList: true, // 观察子节点的 删除/创建
        characterData: true, // 观察 文本变更
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [targetElement, updateStyle])

  // 观察 sider 由于折叠 产生的DOM变化 ，重新计算位置信息
  React.useEffect(() => {
    const asiderElement = document.querySelector(`.${ARCO_LAYOUT_SIDER_CLASS}`)

    const observer = new MutationObserver(updateStyle)
    // asider 监听 width(attributes 属性) 变化
    if (asiderElement) observer.observe(asiderElement, { attributes: true })
    // 停止 观察
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect()
    }
  }, [updateStyle])

  // 必要情况下 监听 ARCO_LAYOUT_CONTENT_CLASS 容器滚动事件 重新计算位置信息
  React.useEffect(() => {
    if (targetElement) {
      const shouldListenScroll = judgeShouldListenScroll(targetElement)
      if (!shouldListenScroll) return
      const arcoLayoutConentElement = document.querySelector(
        `.${ARCO_LAYOUT_CONTENT_CLASS}`
      )
      if (arcoLayoutConentElement) {
        arcoLayoutConentElement.addEventListener('scroll', updateStyle)
        // 卸载 事件监听
        // eslint-disable-next-line consistent-return
        return () => {
          arcoLayoutConentElement.removeEventListener('scroll', updateStyle)
        }
      }
    }
  }, [targetElement, updateStyle])

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
