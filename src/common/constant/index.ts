import packageJson from '@/../package.json'

// 项目/平台本身的 常量

export const PLATFORM_LOGO_PUBLIC_URL =
  'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png'

// TODO: 校验 在生产环境 打包之后  能否正常 访问 package.json
export const PLATFORM_NAME = packageJson.name

export const PLATFORM_VERSION = packageJson.version

// 有关 storage/存储 的常量

export const DATASET_KEY_RESOURCE_COMPONENT_KEY = 'resource_component_key'

export const LOSTORAGE_KEY_PAGE_CONFIGS = 'page_configs'

export const LOSTORAGE_KEY_IS_SIDER_COLLAPSE = 'is_sider_collapse'

// resource-component 有关
// 由 源组件 渲染 出来的 元素 公共类
export const RESOURCE_COMPONENT_COMMON_CLASS = 'resource_component'

// RC外城绝对定位容器的 公共类名
export const RESOURCE_COMPONENT_ABSOLUTE_CONTAINER_CLASS = `${RESOURCE_COMPONENT_COMMON_CLASS}_absolute_container`

// 可能 会 变化为 sticky 定位的 元素 公共类名
export const RESOURCE_COMPONENT_WILL_STICKY_CLASS = `${RESOURCE_COMPONENT_COMMON_CLASS}_will_sticky`

// element 相关

export const ARCO_LAYOUT_SIDER_CLASS = 'arco-layout-sider'

export const ARCO_LAYOUT_CONTENT_CLASS = 'arco-layout-content'

export const PREVIEWER_CONTAINER_CLASS = 'previewer_container'

export const PAGE_CONTAINER_CLASS = 'page_container'

export const PREVIEWER_CLASS = 'previewer'

export const IS_SET_CORLOR_VARIABLE_KEY = '--is-set-color-variable'

export const FONT_STYLE_NODE_ID = 'font_style_node'

// 配置
export const NANO_ID_LENGTH = 10

// 其他

export const BLEND_MODE_DOC_HREF =
  'https://developer.mozilla.org/zh-CN/docs/Web/CSS/blend-mode'
