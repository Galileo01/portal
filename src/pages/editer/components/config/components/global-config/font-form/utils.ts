import { FontList, FontType } from '@/@types/portal-network'

export const filterFontByType = (fontList: FontList, type: FontType) =>
  fontList.filter((font) => font.type === type)

export const computeCascaderOptions = (fontList: FontList) => {
  const options = []

  const systemExist = filterFontByType(fontList, 'system_exist')
  const platformProvide = filterFontByType(fontList, 'platform_provide')
  const userAdd = filterFontByType(fontList, 'user_add')
  if (systemExist.length > 0) {
    options.push({
      name: '系统内置',
      children: systemExist,
    })
  }
  if (platformProvide.length > 0) {
    options.push({
      name: '平台提供',
      children: platformProvide,
    })
  }
  if (userAdd.length > 0) {
    options.push({
      name: '用户添加',
      children: userAdd,
    })
  }
  return options
}
