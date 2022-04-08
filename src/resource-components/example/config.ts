import * as React from 'react'

import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import Example from './index'

export const componentConfig: ResourceComponent = {
  name: '颜色测试组件',
  key: 'example',
  previewImg: 'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png',
  category: ComponentCategoryEnum.NAVIGATION,
  component: Example as React.FC<unknown>,
  props: Object,
  propsSchema: {
    logoSrc: {
      label: 'logo 地址',
      type: PropTypeEnum.STRING,
    },
    navList: {
      type: PropTypeEnum.ARRAY,
      label: '导航列表',
      maxItems: 4,
      minItems: 1,
      item: {
        type: PropTypeEnum.OBJECT,
        properties: {
          title: {
            label: '标题',
            type: PropTypeEnum.STRING,
          },
          href: {
            label: '地址',
            type: PropTypeEnum.STRING,
          },
        },
      },
    },
    height: {
      label: '高度',
      type: PropTypeEnum.NUMBER,
    },
  },
}

export default componentConfig
