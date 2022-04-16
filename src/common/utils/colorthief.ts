import ColorThief, { Color } from 'colorthief'

let colorThief: ColorThief | null = null

export const getColorAsync = (img: HTMLImageElement) =>
  new Promise<Color>((resolve) => {
    if (!colorThief) {
      colorThief = new ColorThief()
    }
    // 强制  放到 下一个事件循环中 resolve
    setTimeout(() => {
      const color = colorThief!.getColor(img)
      resolve(color)
    }, 0)
  })

export const getPaletteAsync = (img: HTMLImageElement) =>
  new Promise<Array<Color>>((resolve) => {
    if (!colorThief) {
      colorThief = new ColorThief()
    }
    // 强制  放到 下一个事件循环中 resolve
    setTimeout(() => {
      const colors = colorThief!.getPalette(img)
      resolve(colors)
    }, 0)
  })
