import { MetaConfigData } from '@/typings/common/editer-config-data'

export const generateElementFromMetaInfo = (metaConfig: MetaConfigData) => {
  const { favicon, meta } = metaConfig
  if (favicon) {
    const iconLinkEle: HTMLLinkElement | null =
      document.querySelector('link[rel="icon"]')
    if (iconLinkEle) {
      iconLinkEle.href = favicon
    }
  }

  if (meta) {
    const attrs = Object.keys(meta)

    const metaElements = attrs.map((attr) => {
      const metaEle = document.createElement('meta')
      metaEle.name = attr
      const value = meta[attr]

      metaEle.content = typeof value === 'string' ? value : value.join(',')
      return metaEle
    })

    document.head.append(...metaElements)
  }
}

export default generateElementFromMetaInfo
