import * as React from 'react'

import clsx from 'clsx'
import { useNavigate, useLocation } from 'react-router-dom'

import logo from '@/assets/img/logo.png'
import { ROUTE_INDEX } from '@/common/constant/route'

import styles from './index.module.less'

export const DEFAULT_LOGO_SIZE = 100

type LogoProps = {
  className?: string
  /**
   * @size : 默认大小为 100*100
   */
  size?: number
  /**
   * @circle : logo 是否是圆的
   */
  circle?: boolean
  /**
   * @showText : 默认值 true ：是否只展示 logo 不展示 “Portal” 文字
   */
  showText?: boolean
  /**
   * @jumpWhenClick : 默认值 true ： 是否在点击的时候跳转到 首页
   */
  jumpWhenClick?: boolean
}

const Logo: React.FC<LogoProps> = (props) => {
  const {
    className,
    size = DEFAULT_LOGO_SIZE,
    circle = false,
    showText = true,
    jumpWhenClick = true,
  } = props

  const navigater = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    if (jumpWhenClick && location.pathname !== ROUTE_INDEX) {
      navigater(ROUTE_INDEX)
    }
  }

  return (
    <div
      className={clsx(styles.logo_wrapper, className, 'cursor_pointer')}
      onClick={handleClick}
    >
      <img
        src={logo}
        alt="portal-logo"
        title="portal"
        className={clsx('portal-logo', circle && styles.circle)}
        style={{
          width: size,
          height: size,
        }}
      />
      {showText && <span className={styles.text}>Portal</span>}
    </div>
  )
}

export default Logo
