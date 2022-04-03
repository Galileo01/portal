import * as React from 'react'

import clsx from 'clsx'

import { RESOURCE_COMPONENT_RENDERED_COMMON_CLASS } from '@/common/constant'
import { CommonProps } from '@/typings/resosurce-component'

import styles from './index.module.less'

const Example: React.FC<CommonProps> = (props) => (
  <div
    className={clsx(styles.example, RESOURCE_COMPONENT_RENDERED_COMMON_CLASS)}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <p>容器背景示例</p>
    <div className={styles.level1ContainerBg}>
      一级容器
      <div className={styles.level2ContainerBg}>
        二级容器
        <div className={styles.level3ContainerBg}>
          三级容器
          <div className={styles.level4ContainerBg}>弹出式容器</div>
        </div>
      </div>
    </div>
    <p>字体颜色示例</p>
    <p className={styles.titleColor}>标题字体</p>
    <p className={styles.sentenceColor}>语句字体</p>
    <p className={styles.secondaryTextColor}>次要信息字体</p>
    <p className={styles.forbidTextColor}>禁用状态字体</p>
  </div>
)

export default Example
