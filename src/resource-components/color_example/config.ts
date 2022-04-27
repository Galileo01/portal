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
  category: ComponentCategoryEnum.OTHER,
  component: Example as React.FC<unknown>,
  props: Object,
  propsSchema: {
    name: {
      type: PropTypeEnum.STRING,
      label: '测试字段',
    },
  },
}

export default componentConfig
