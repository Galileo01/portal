import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { CommonProps } from '@/typings/common/resosurce-component'
import CustomImage from '@/components/custom-image'

import { RCClassnameComputer } from '../utils'
import styles from './index.module.less'

const { Header } = Layout

const DEFAULT_NAV_HEIGHT = 60

export type NavProps = {
  logoSrc: string
  height?: number
  className?: string
  isSticky?: boolean
  navList: Array<{
    title: string
    href: string
  }>
} & CommonProps

const Nav: React.FC<NavProps> = (props) => {
  const {
    logoSrc,
    navList,
    className,
    isSticky,
    height = DEFAULT_NAV_HEIGHT,
    ...elementProps
  } = props
  return (
    <Header
      className={RCClassnameComputer(
        { willSticky: true },
        styles.nav,
        className,
        isSticky && styles.sticky
      )}
      style={{
        height,
      }}
      {...elementProps}
    >
      <CustomImage src={logoSrc} preview={false} height={height - 10} />
      <div className={styles.nav_list}>
        {navList.map(({ title, href }) => (
          <a
            className={styles.nav_item}
            key={title}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>
        ))}
      </div>
    </Header>
  )
}

export default Nav
