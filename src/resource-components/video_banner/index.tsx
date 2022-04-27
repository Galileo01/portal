import * as React from 'react'

import ContentTitle, { ContentTitleProps } from '../content_title'
import { RCClassnameComputer } from '../utils'

import styles from './index.module.less'

export type VideoBannerProps = {
  videoConfig: {
    src: string
    poster?: string
    height?: number
    width?: number
    controls?: boolean
    autoPlay?: boolean
    loop?: boolean
  }
} & ContentTitleProps

const VideoBanner: React.FC<VideoBannerProps> = (props) => {
  const {
    title,
    secondaryText,
    videoConfig: {
      src,
      poster,
      height = 300,
      width = 600,
      controls,
      autoPlay,
      loop,
    },
    ...rest
  } = props

  return (
    <div className={RCClassnameComputer({}, styles.video_banner)} {...rest}>
      <ContentTitle title={title} secondaryText={secondaryText} />
      <div
        className={styles.video_wrapper}
        style={{
          height,
          width,
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          poster={poster}
          width="100%"
          height="100%"
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
        >
          <source src={src} />
        </video>
      </div>
    </div>
  )
}

export default VideoBanner
