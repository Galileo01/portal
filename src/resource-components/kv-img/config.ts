import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import KVImg, { KVImgProps } from './index'

const initProps: KVImgProps = {
  src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  objectFit: 'fill',
}

export const componentConfig: ResourceComponent<KVImgProps> = {
  name: 'KV主图',
  key: 'KV_img',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/kv_img_preview.png',
  category: ComponentCategoryEnum.BANNER,
  component: KVImg,
  props: initProps,
  propsSchema: {
    src: {
      label: '图片url',
      type: PropTypeEnum.STRING,
    },
    imgHeight: {
      label: '图片高度',
      emptyHint: '默认值200px',
      type: PropTypeEnum.NUMBER,
      unit: 'px',
    },
    imgWidth: {
      label: '图片宽度',
      emptyHint: '默认值父元素100%',
      type: PropTypeEnum.STRING,
      unit: 'px',
    },
    objectFit: {
      label: '适应方式',
      help: '嵌入的图片如何适应容器的大小',
      type: PropTypeEnum.STRING,
      enums: [
        {
          label: '默认填充(可能拉伸)',
          value: 'fill',
        },
        {
          label: '原有尺寸',
          value: 'none',
        },
        {
          label: '包含于(可能存在白边)',
          value: 'contain',
        },
        {
          label: '覆盖(可能裁剪图像)',
          value: 'cover',
        },
        {
          label: '尺寸小的方式',
          value: 'scale-down',
        },
      ],
    },
  },
}

export default componentConfig
