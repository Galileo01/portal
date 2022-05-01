import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import InfoHorizontal, { InfoHorizontalProps } from './index'

export const initProps: InfoHorizontalProps = {
  textConfig: {
    title: '标题名',
    description: '大致描述',
    content: '内容,详细说明',
  },
  imgConfig: {
    src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  },
}

const config: ResourceComponent<InfoHorizontalProps> = {
  name: '信息-水平类型',
  key: 'info_horizontal',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/info_horizontal_preview.png',
  category: ComponentCategoryEnum.CONTENT,
  component: InfoHorizontal,
  props: initProps,
  propsSchema: {
    textConfig: {
      label: '文本配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        title: {
          label: '标题',
          type: PropTypeEnum.STRING,
        },
        description: {
          label: '描述文案',
          type: PropTypeEnum.STRING,
        },
        content: {
          label: '内容',
          type: PropTypeEnum.STRING,
        },
      },
    },
    imgConfig: {
      label: '图片配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        src: {
          label: '图片url',
          type: PropTypeEnum.STRING,
        },
        imgHeight: {
          label: '图片高度',
          emptyHint: '默认值600px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
        imgWidth: {
          label: '图片宽度',
          emptyHint: '默认值600px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
      },
    },
  },
}

export default config
