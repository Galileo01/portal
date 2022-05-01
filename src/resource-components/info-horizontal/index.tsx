import * as React from 'react'

import CustomImage from '@/components/custom-image'

import { RCClassnameComputer } from '../utils'

import styles from './index.module.less'

export type InfoHorizontalProps = {
  textConfig: {
    title: string
    description: string
    content?: string
  }
  imgConfig: {
    src: string
    imgHeight?: string
    imgWidth?: string
  }
}

const InfoHorizontal: React.FC<InfoHorizontalProps> = (props) => {
  const { textConfig, imgConfig, ...elementProps } = props
  const { src, imgHeight = 600, imgWidth = 600 } = imgConfig
  return (
    <div
      className={RCClassnameComputer({}, styles.info_horizontal)}
      {...elementProps}
    >
      <div className={styles.text_wrapper}>
        <h1>{textConfig.title}</h1>
        <h3>{textConfig.description}</h3>
        <p>{textConfig.content}</p>
      </div>
      <div className={styles.img_wrapper}>
        <CustomImage src={src} height={imgHeight} width={imgWidth} />
      </div>
    </div>
  )
}

export default InfoHorizontal
