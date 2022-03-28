import packageJson from '@/../package.json'

// 项目/平台本身的 常量

// TODO: 校验 在生产环境 打包之后  能否正常 访问 package.json
export const PLATFORM_NAME = packageJson.name

export const PLATFORM_VERSION = packageJson.version

// 有关 storage/存储 的常量

export const DATASET_KEY_RESOURCE_COMPONENT_KEY = `${PLATFORM_NAME}_resource_component_key`

export const LOSTORAGE_KEY_COMPONENT_CONFIG = `${PLATFORM_NAME}_component_config`

// resource-component 有关
// 由 源组件 渲染 出来的 元素 公共类
export const RESOURCE_COMPONENT_RENDERED_COMMON_CLASS = `${PLATFORM_NAME}_resource_component_rendered`

export const PREVIEWER_CLASS = `${PLATFORM_NAME}_previewer`

export const ARCO_LAYOUT_SIDER_CLASS = 'arco-layout-sider'

export const PREVIEWER_CONTAINER_CLASS = `${PLATFORM_NAME}_previewer_container`

// 配置
export const NANO_ID_LENGTH = 10
