import * as React from 'react'

import {
  Modal,
  ModalProps,
  Upload,
  UploadProps,
  Message,
} from '@arco-design/web-react'
import { IconPlus, IconEdit } from '@arco-design/web-react/icon'
import { UploadItem } from '@arco-design/web-react/es/Upload/interface'
import { Color } from 'colorthief'
import tinycolor from 'tinycolor2'

import { getColorAsync, getPaletteAsync } from '@/common/utils/colorthief'

import styles from './index.module.less'

export type PaletteModalProps = Omit<ModalProps, 'onConfirm'> & {
  onConfirm?: (colors: string[]) => void
}

export type ColorInfo = {
  dominant?: Color
  palette: Color[]
}

const defaultColorInfo: ColorInfo = {
  palette: [],
}

const PaletteModal: React.FC<PaletteModalProps> = (props) => {
  const { onConfirm, onCancel, ...rest } = props

  const [imgFile, setImgFile] = React.useState<UploadItem>()

  const imgElementRef = React.useRef<HTMLImageElement>(null)
  const [loading, setLoading] = React.useState(false)
  const [colorInfo, setColor] = React.useState<ColorInfo>(defaultColorInfo)

  // 主动 释放 url 优化 内存占用
  const revokeUrl = () => {
    if (imgFile?.url) {
      URL.revokeObjectURL(imgFile?.url)
    }
  }

  // modal handler

  const resetState = () => {
    setColor(defaultColorInfo)
    revokeUrl()
    setImgFile(undefined)
  }

  const handleConfirm = () => {
    if (!colorInfo.dominant) {
      Message.warning('请先选择图片并生成调色板')
      return
    }
    // rgb 转换为 hex
    const [dominantR, dominantG, dominantB] = colorInfo.dominant!
    const paletteColors: string[] = []

    paletteColors.push(
      tinycolor({
        r: dominantR,
        g: dominantG,
        b: dominantB,
      }).toHexString()
    )

    colorInfo.palette.forEach(([r, g, b]) => {
      paletteColors.push(
        tinycolor({
          r,
          g,
          b,
        }).toHexString()
      )
    })

    onConfirm?.(paletteColors)
    Message.success('定制成功，重新打开选色器查看')
    resetState()
  }

  const handleCancel = () => {
    onCancel?.()
    resetState()
  }

  const handleColorGenerate = () => {
    if (imgElementRef.current) {
      setLoading(true)

      Promise.all([
        getColorAsync(imgElementRef.current),
        getPaletteAsync(imgElementRef.current),
      ]).then((res) => {
        const [dominant, palette] = res
        setColor({
          dominant,
          palette,
        })
        setLoading(false)
      })
    }
  }

  // upload handler

  const handleUploadChange: UploadProps['onChange'] = (_, currentFile) => {
    revokeUrl()
    setImgFile({
      ...currentFile,
      url: currentFile.originFile
        ? URL.createObjectURL(currentFile.originFile)
        : undefined,
    })
  }

  // imgElement 加载成功 后 进行 色值提取
  React.useEffect(() => {
    const refCopy = imgElementRef.current

    const imgLoaded = Boolean(imgFile?.url && refCopy?.complete)

    if (imgLoaded) {
      handleColorGenerate()
      return
    }
    refCopy?.addEventListener('load', handleColorGenerate)
    // eslint-disable-next-line consistent-return
    return () => {
      refCopy?.removeEventListener('load', handleColorGenerate)
    }
  }, [imgFile])

  return (
    <Modal
      {...rest}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title="定制你的调色板"
      className={styles.palette_modal}
    >
      <span className="tip_text">选择图片生成主题色和调色板</span>
      <Upload
        showUploadList={false}
        accept="image/*"
        onChange={handleUploadChange}
      >
        <div className={styles.upload_trigger}>
          {imgFile && imgFile.url ? (
            <div className={styles.img_show}>
              <img src={imgFile?.url} alt="img_uplaod" ref={imgElementRef} />
              <div className={styles.edit_mask}>
                <IconEdit />
              </div>
            </div>
          ) : (
            <div className={styles.upload_wrapper}>
              <IconPlus />
              <span className={styles.upload_text}>选择图片</span>
            </div>
          )}
        </div>
      </Upload>
      <div className={styles.result}>
        <div className={styles.dominant}>
          <h3>主题色</h3>
          {colorInfo.dominant ? (
            <div
              className={styles.dominant_color_circle}
              style={{
                backgroundColor: `rgb(${colorInfo.dominant[0]},${colorInfo.dominant[1]},${colorInfo.dominant[2]})`,
              }}
            />
          ) : (
            <span className="tip_text">
              {loading ? '生成中...' : '未选择图片'}
            </span>
          )}
        </div>
        <div className={styles.palette}>
          <h3>调色板</h3>
          {colorInfo.palette.length > 0 ? (
            <div className={styles.color_list}>
              {colorInfo.palette.map(([r, g, b], index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`palette_${index}`}
                  className={styles.color_circle}
                  style={{
                    backgroundColor: `rgb(${r},${g},${b})`,
                  }}
                />
              ))}
            </div>
          ) : (
            <span className="tip_text">
              {loading ? '生成中...' : '未选择图片'}
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PaletteModal
