import * as React from 'react'

import { Dropdown, Menu } from '@arco-design/web-react'
import { IconSun, IconMoon, IconDesktop } from '@arco-design/web-react/icon'
import clsx from 'clsx'

import {
  globalThemeMediaQueryList,
  setArcoThemeMoon,
  setArcoThemeSun,
  removeArcoThemeFollowSystem,
  setArcoThemeFollowSystem,
} from './utils'

import styles from './index.module.less'

const { Item: MenuItem } = Menu

export enum ThemeModeEnum {
  SUN = 'sun',
  MOON = 'moon',
  SYSTEM = 'system',
}

export const options = [
  {
    value: '亮色模式',
    key: ThemeModeEnum.SUN,
    icon: <IconSun />,
  },
  {
    value: '暗色模式',
    key: ThemeModeEnum.MOON,
    icon: <IconMoon />,
  },
  {
    value: '跟随系统',
    key: ThemeModeEnum.SYSTEM,
    icon: <IconDesktop />,
  },
]

const ThemeSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const [themeMode, setThemeMode] = React.useState<ThemeModeEnum>(
    ThemeModeEnum.SUN
  )

  const triggerElement = React.useMemo(
    () => (
      <div className={clsx('cursor_pointer', styles.trigger)}>
        {options.find((option) => option.key === themeMode)?.icon}
      </div>
    ),
    [themeMode]
  )

  const handleItemClick = (value: string) => {
    switch (value) {
      case ThemeModeEnum.MOON:
        setArcoThemeMoon()
        // 移除 监听
        if (themeMode === ThemeModeEnum.SYSTEM) {
          removeArcoThemeFollowSystem()
        }
        break
      case ThemeModeEnum.SUN:
        setArcoThemeSun()
        if (themeMode === ThemeModeEnum.SYSTEM) {
          removeArcoThemeFollowSystem()
        }
        break
      case ThemeModeEnum.SYSTEM:
        // 若当前系统 为 亮色模式
        if (!globalThemeMediaQueryList.matches) {
          setArcoThemeSun()
        }
        setArcoThemeFollowSystem()
        break
      default:
        setArcoThemeSun()
        break
    }
    setThemeMode(value as ThemeModeEnum)
  }

  return (
    <div className={clsx(styles.theme_switch, className)}>
      <Dropdown
        droplist={
          <Menu onClickMenuItem={handleItemClick}>
            {options.map(({ value, key, icon }) => (
              <MenuItem key={key}>
                {icon} {value}
              </MenuItem>
            ))}
          </Menu>
        }
        position="bottom"
      >
        {triggerElement}
      </Dropdown>
    </div>
  )
}

export default ThemeSwitch
