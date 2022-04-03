import * as React from 'react'

import { Layout } from '@arco-design/web-react'
import clsx from 'clsx'

import { RESOURCE_COMPONENT_RENDERED_COMMON_CLASS } from '@/common/constant'
import { CommonProps } from '@/typings/resosurce-component'
import CustomImage from '../components/custom-image'

import styles from './index.module.less'

const { Header } = Layout

const DEFAULT_NAV_HEIGHT = 60

export type NavProps = {
  logoSrc: string
  navList: Array<{
    title: string
    href: string
  }>
  height?: number
  className?: string
} & CommonProps

// TEST: 用于 从测试的 源组件
// TODO: 使用栅格系统 ，并暴露组件

const Nav: React.FC<NavProps> = (props) => {
  const {
    logoSrc,
    navList,
    className,
    height = DEFAULT_NAV_HEIGHT,
    ...restProps
  } = props
  return (
    <Header
      className={clsx(
        styles.nav,
        className,
        RESOURCE_COMPONENT_RENDERED_COMMON_CLASS
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
