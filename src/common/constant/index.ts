import packageJson from '@/../package.json'

// 项目/ 平台本身的 常量

// TODO: 校验 在生产环境 打包之后  能否正常 访问 package.json
export const PLATFORM_NAME = packageJson.name

export const PLATFORM_VERSION = packageJson.version

// 有关 storage 的常量

export const DATASET_KEY_COMPONENT_KEY = 'component_key'

export const LOSTORAGE_KEY_COMPONENT_CONFIG = 'component_config'

// resource-component 有关
export const RESOURCE_COMPONENT_COMMON_CLASS = 'portal_resource_component'
