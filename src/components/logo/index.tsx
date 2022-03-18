import React from 'react'

import clsx from 'clsx'

import logo from '@/assets/img/logo.png'

import style from './index.module.less'

export const DEFAULT_LOGO_SIZE = 100

type LogoProps = {
  className?: string
  size?: number
}

const Logo: React.FC<LogoProps> = ({ className, size = DEFAULT_LOGO_SIZE }) => (
  <img
    className={clsx(style.logo, className)}
    src={logo}
    alt="portal-logo"
    title="portal"
    style={{
      width: size,
      height: size,
    }}
  />
)

export default Logo
