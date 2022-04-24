import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { RESOURCE_COMPONENT_WILL_STICKY_CLASS } from '@/common/constant'
import { CommonProps } from '@/typings/common/resosurce-component'
import { RCClassnameComputer } from '@/common/utils/element'
import CustomImage from '@/components/custom-image'

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
    ...restProps
  } = props
  return (
    <Header
      className={RCClassnameComputer(
        RESOURCE_COMPONENT_WILL_STICKY_CLASS,
        styles.nav,
        className,
        isSticky && styles.sticky
      )}
      style={{
        height,
      }}
      {...restProps}
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
