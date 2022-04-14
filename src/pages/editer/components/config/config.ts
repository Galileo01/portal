export type ConfigPaneBaseProps = {
  active: boolean
}

export const COLLAPSE_BASE_PROPS = {
  lazyload: true,
  bordered: false,
  expandIconPosition: 'right' as 'left' | 'right', // 解决   string 到 'left' | 'right'类型的不可 赋值性
  accordion: true,
}

export enum ConfigPaneNameEnum {
  GLOBAL_CONFIG = 'global_config',
  PROPS_CONFIG = 'props_config',
  STYLE_CONFI = 'style_config',
}
