import packageJson from '@/../package.json'

// 项目/平台本身的 常量

export const PLATFORM_LOGO_PUBLIC_URL =
  'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png'

// TODO: 校验 在生产环境 打包之后  能否正常 访问 package.json
export const PLATFORM_NAME = packageJson.name

export const PLATFORM_VERSION = packageJson.version

// 有关 storage/存储 的常量

export const DATASET_KEY_RESOURCE_COMPONENT_KEY = 'resource_component_key'

export const LOSTORAGE_KEY_COMPONENT_CONFIG = 'component_config'

export const LOSTORAGE_KEY_IS_SIDER_COLLAPSE = 'is_sider_collapse'

// resource-component 有关
// 由 源组件 渲染 出来的 元素 公共类
export const RESOURCE_COMPONENT_RENDERED_COMMON_CLASS =
  'resource_component_rendered'

// element 相关

export const ARCO_LAYOUT_SIDER_CLASS = 'arco-layout-sider'

export const PREVIEWER_CONTAINER_CLASS = 'previewer_container'

export const PAGE_CONTAINER_CLASS = 'page_container'

export const PREVIEWER_CLASS = 'previewer'

export const IS_SET_CORLOR_VARIABLE_KEY = '--is-set-color-variable'

// 配置
export const NANO_ID_LENGTH = 10
