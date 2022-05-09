import packageJson from '@/../package.json'

// 项目/平台本身的 常量

export const PLATFORM_LOGO_PUBLIC_URL =
  'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png' // TODO: 上传到 腾讯云

// TODO: 校验 在生产环境 打包之后  能否正常 访问 package.json
export const PLATFORM_NAME = packageJson.name

export const PLATFORM_VERSION = packageJson.version
