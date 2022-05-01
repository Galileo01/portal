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
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/example_preview.png',
  category: ComponentCategoryEnum.OTHER,
  component: Example as React.FC<unknown>,
  props: {},
  propsSchema: {
    name: {
      type: PropTypeEnum.STRING,
      label: '测试字段',
    },
  },
}

export default componentConfig
