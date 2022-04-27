import * as React from 'react'

import { Carousel, CarouselProps } from '@arco-design/web-react'
import CustomImage from '@/components/custom-image'

import styles from './index.module.less'

import { RCClassnameComputer } from '../utils'

export type SwiperProps = {
  swiperConfig: {
    height?: number
    width?: number
    autoPlay?: boolean
    moveSpeed: number
    animation: CarouselProps['animation']
    showArrow: CarouselProps['showArrow']
    indicatorType: CarouselProps['indicatorType']
  }
  imgList: Array<string>
}

const Swiper: React.FC<SwiperProps> = (props) => {
  const { swiperConfig, imgList, ...restProps } = props
  const { height = 240, width = '100%', ...restConfig } = swiperConfig

  return (
    <div className={RCClassnameComputer({}, styles.swiper)} {...restProps}>
      <Carousel
        style={{
          height,
          width,
        }}
        {...restConfig}
      >
        {imgList.map((src) => (
          <CustomImage src={src} height="100%" width="100%" key={src} />
        ))}
      </Carousel>
    </div>
  )
}

export default Swiper
