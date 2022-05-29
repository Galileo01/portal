import * as React from 'react'

import CustomImage from '@/components/custom-image'

import { RCClassnameComputer } from '../utils'

import styles from './index.module.less'

export type GridBoxProps = {
  gridConfig: {
    width?: number
    itemWidth?: number
    itemHeight?: number
    rowGap?: number
    columnGap?: number
  }
  itemList: Array<{
    img: string
    description?: string
  }>
}

const GridBox: React.FC<GridBoxProps> = (props) => {
  const { gridConfig, itemList, ...elementProps } = props
  const {
    width,
    itemHeight = 300,
    itemWidth = 300,
    rowGap = 20,
    columnGap = 20,
  } = gridConfig
  return (
    <div
      className={RCClassnameComputer({}, styles.grid_box)}
      {...elementProps}
      style={{
        width,
        gridTemplateColumns: `repeat(auto-fill,${itemWidth}px)`,
        gridTemplateRows: `repeat(auto-fill,${itemHeight}px)`,
        gap: `${rowGap}px ${columnGap}px`,
      }}
    >
      {itemList.map((item) => (
        <div
          className={styles.grid_item}
          key={item.img}
          style={{
            height: itemHeight,
            width: itemWidth,
          }}
        >
          <CustomImage src={item.img} height="90%" width="100%" />
          <div className="line_1 description">{item.description}</div>
        </div>
      ))}
    </div>
  )
}

export default GridBox
