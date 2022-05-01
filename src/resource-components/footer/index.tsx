import * as React from 'react'

import { RCClassnameComputer } from '../utils'

import styles from './index.module.less'

export type FooterProps = {
  text: string
}

const Footer: React.FC<FooterProps> = (props) => {
  const { text, ...elementProps } = props

  return (
    <footer
      className={RCClassnameComputer({}, styles.footer)}
      {...elementProps}
    >
      {text}
    </footer>
  )
}

export default Footer
