import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import BackTop, { BackTopProps } from '.'

const initProps: BackTopProps = {
  isEditer: true,
  visibleHeight: 30,
  duration: 400,
}

const config: ResourceComponent<BackTopProps> = {
  name: '返回顶部',
  key: 'backtop',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/back_top_preview.png',
  category: ComponentCategoryEnum.OTHER,
  component: BackTop,
  props: initProps,
  propsSchema: {
    visibleHeight: {
      label: '显示距离',
      help: '页面滚动多少距离时才展示',
      type: PropTypeEnum.NUMBER,
      emptyHint: '默认值30px',
      unit: 'px',
    },
    duration: {
      label: '滚动时间',
      type: PropTypeEnum.NUMBER,
      unit: 'ms',
    },
  },
}

export default config
