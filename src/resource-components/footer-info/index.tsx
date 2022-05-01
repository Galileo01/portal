import * as React from 'react'

import CustomImage from '@/components/custom-image'
import { RCClassnameComputer } from '../utils'

import styles from './index.module.less'

export type FooterInfoProps = {
  logoConfig?: {
    src: string
    height?: number
    width?: number
  }
  textList: Array<{
    text: string
    href?: string
  }>
}

const FooterInfo: React.FC<FooterInfoProps> = (props) => {
  const { logoConfig, textList, ...elementProps } = props
  const { src, height = 50, width = 50 } = logoConfig || {}

  return (
    <footer
      className={RCClassnameComputer({}, styles.footer_info)}
      {...elementProps}
    >
      {src && <CustomImage src={src} height={height} width={width} />}
      <div className={styles.text_list}>
        {textList.map(({ text, href }) => {
          if (href) {
            return (
              <a href={href} className={styles.text_item}>
                {text}
              </a>
            )
          }
          return <div className={styles.text_item}>{text}</div>
        })}
      </div>
    </footer>
  )
}

export default FooterInfo
