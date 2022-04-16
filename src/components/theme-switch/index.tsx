import * as React from 'react'

import { Select } from '@arco-design/web-react'
import { IconSun, IconMoon, IconDesktop } from '@arco-design/web-react/icon'

const { Option } = Select

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

export const globalThemeMediaQueryList =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')

export const setArcoThemeMoon = () => {
  document.body.setAttribute('arco-theme', 'dark')
}

export const setArcoThemeSun = () => {
  document.body.removeAttribute('arco-theme')
}

const handleMediaQueryChange = (e: MediaQueryListEvent) => {
  if (e.matches) {
    setArcoThemeMoon()
  } else {
    setArcoThemeSun()
  }
}

export const setArcoThemeFollowSystem = () => {
  globalThemeMediaQueryList.addEventListener('change', handleMediaQueryChange)
}

export const removeArcoThemeFollowSystem = () => {
  globalThemeMediaQueryList.removeEventListener(
    'change',
    handleMediaQueryChange
  )
}

const ThemeSwitch = () => {
  const [themeMode, setThemeMode] = React.useState<ThemeModeEnum>(
    ThemeModeEnum.SUN
  )

  const handleSelectChange = (value: ThemeModeEnum) => {
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
    setThemeMode(value)
  }

  return (
    <Select value={themeMode} onChange={handleSelectChange}>
      {options.map(({ value, key, icon }) => (
        <Option key={key} value={key}>
          {icon} {value}
        </Option>
      ))}
    </Select>
  )
}

export default ThemeSwitch
