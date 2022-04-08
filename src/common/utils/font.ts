import { FontList } from '@/@types/portal-network'
import { FONT_STYLE_NODE_ID } from '@/common/constant'
import { devLogger } from '@/common/utils'

export const createFontStyleNode = (fontList: FontList) => {
  let targetNode = document.querySelector(`#${FONT_STYLE_NODE_ID}`)

  const isFontStyleNodeExisted = Boolean(targetNode)
  if (!isFontStyleNodeExisted) {
    targetNode = document.createElement('style')
    targetNode.id = FONT_STYLE_NODE_ID
    targetNode.setAttribute('type', 'text/css')
  }
  const innerHTML = fontList.reduce((pre, cur) => {
    const { name, src } = cur
    return `${pre}
    @font-face{
      font-family:"${name}";
      font-display:swap;
      src:url("${src}");
    }`
  }, '')
  devLogger('innerHTML', innerHTML)
  targetNode!.innerHTML = innerHTML
  if (!isFontStyleNodeExisted) {
    document.head.appendChild(targetNode!)
    devLogger('appendChild', targetNode)
  }
}

export const removeFontStyleNode = () => {
  const styleNode = document.querySelector(`#${FONT_STYLE_NODE_ID}`)
  if (styleNode) {
    document.head.removeChild(styleNode)
  }
}
