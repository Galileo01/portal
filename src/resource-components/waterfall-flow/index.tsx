import * as React from 'react'

import clsx from 'clsx'

import { RCClassnameComputer } from '../utils'
import styles from './index.module.less'
import { devLogger } from '@/common/utils'

export type WaterFallFlowProps = {
  flowConfig: {
    containerWidth?: number
    column?: number
    columnGap?: number
  }
  itemList: Array<{
    img: string
    description?: String
  }>
}

const GRID_AUTO_ROWS = 10
const OTHER_HEIGHT = 30

const WaterFallFlow: React.FC<WaterFallFlowProps> = (props) => {
  const { flowConfig, itemList, ...elementProps } = props
  const { column = 4, columnGap = 10, containerWidth = 1200 } = flowConfig

  const containerElementRef = React.useRef<HTMLDivElement | null>(null)

  const setGridStyle = (imgHeight: number, index: number) => {
    // 计算 占用的行数 grid-row 属性
    const span = Math.ceil((imgHeight + OTHER_HEIGHT) / GRID_AUTO_ROWS)
    // 查找并设置父元素 flow_item 样式
    const flowItemElement = containerElementRef.current?.querySelector(
      `.flow_item:nth-of-type(${index + 1})`
    ) as HTMLDivElement | null | undefined

    flowItemElement?.style.setProperty('grid-row', `auto / span ${span}`)
    devLogger('setGridStyle', imgHeight, span)
  }

  const handleImgLoadGenerator: (
    index: number
  ) => React.ReactEventHandler<HTMLImageElement> = (index: number) => (e) => {
    setGridStyle((e.target as HTMLImageElement).height, index)
  }

  // column, containerWidth 更新从 重新计算span

  React.useEffect(() => {
    devLogger('re compute')
    const imgElements = [
      ...(containerElementRef.current?.getElementsByClassName(`img_item`) ||
        []),
    ] as HTMLImageElement[]
    imgElements.forEach((img, index) => {
      setGridStyle(img.height, index)
    })
  }, [column, containerWidth])

  return (
    <div
      className={RCClassnameComputer({}, styles.waterfall_flow)}
      ref={containerElementRef}
      style={{
        width: containerWidth,
        gridAutoRows: GRID_AUTO_ROWS,
        gridTemplateColumns: `repeat(${column},1fr)`,
        columnGap,
      }}
      {...elementProps}
    >
      {itemList.map((item, index) => (
        <div className={clsx(styles.flow_item, 'flow_item')} key={item.img}>
          <img
            src={item.img}
            alt="flow_img_item"
            className={clsx(styles.img, 'img_item')}
            onLoad={handleImgLoadGenerator(index)}
          />
          <div className={clsx('line_1', styles.desc)}>{item.description}</div>
        </div>
      ))}
    </div>
  )
}

export default WaterFallFlow
