export type ColorVarMap = Record<
  string,
  {
    label: string
    varKey: string
  }
>

export type ColorVarValue = Record<string, string>

export const COLOR_VARIABLES: ColorVarMap = {
  mainBg: {
    label: '整体背景',
    varKey: '--color-bg-1',
  },
  level1ContainerBg: {
    label: '一级容器背景',
    varKey: '--color-bg-2',
  },
  level2ContainerBg: {
    label: '二级容器背景',
    varKey: '--color-bg-3',
  },
  level3ContainerBg: {
    label: '三级容器背景',
    varKey: '--color-bg-4',
  },
  level4ContainerBg: {
    label: '弹出式背景',
    varKey: '--color-bg-5',
  },
  titleColor: {
    label: '标题字体',
    varKey: '--color-text-1',
  },
  sentenceColor: {
    label: '语句字体',
    varKey: '--color-text-2',
  },
  secondaryTextColor: {
    label: '次要信息字体',
    varKey: '--color-text-3',
  },
  forbidTextColor: {
    label: '禁用状态字体',
    varKey: '--color-text-4',
  },
}

export const KEY_OF_COLOR_VARIABLES = Object.keys(COLOR_VARIABLES)
