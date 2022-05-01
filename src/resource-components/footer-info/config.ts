import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import FooterInfo, { FooterInfoProps } from './index'

const initProps: FooterInfoProps = {
  logoConfig: {
    src: 'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png',
  },
  textList: [
    {
      text: '关于',
      href: 'https://www.baidu.com',
    },
    {
      text: '联系我们',
      href: 'https://www.google.com/',
    },
    {
      text: '@copyright by Mark',
    },
  ],
}

const config: ResourceComponent<FooterInfoProps> = {
  name: '页脚-更多信息',
  key: 'footer_info',
  category: ComponentCategoryEnum.FOOTER,
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/footer_info_preview.png',
  component: FooterInfo,
  props: initProps,
  propsSchema: {
    logoConfig: {
      label: 'logo配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        src: {
          label: 'url',
          type: PropTypeEnum.STRING,
        },
        height: {
          label: '高度',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
          emptyHint: '默认50px',
        },
        width: {
          label: '宽度',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
          emptyHint: '默认50px',
        },
      },
    },
    textList: {
      label: '信息列表',
      type: PropTypeEnum.ARRAY,
      item: {
        type: PropTypeEnum.OBJECT,
        properties: {
          text: {
            label: '文案',
            type: PropTypeEnum.STRING,
          },
          href: {
            label: '跳转链接',
            type: PropTypeEnum.STRING,
          },
        },
      },
    },
  },
}

export default config
