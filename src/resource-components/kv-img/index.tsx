import * as React from 'react'

import CustomImage from '@/components/custom-image'

import { RCClassnameComputer } from '../utils'
import styles from './index.module.less'

export type KVImgProps = {
  src: string
  imgHeight?: string
  imgWidth?: string
  objectFit?: string
}

const KVImg: React.FC<KVImgProps> = (props) => {
  const {
    src,
    imgHeight = 200,
    imgWidth = '100%',
    objectFit = 'fill',
    ...rest
  } = props

  return (
    <div
      className={RCClassnameComputer({}, styles.kv_img, styles[objectFit])}
      {...rest}
    >
      <CustomImage src={src} width={imgWidth} height={imgHeight} />
    </div>
  )
}

export default KVImg
