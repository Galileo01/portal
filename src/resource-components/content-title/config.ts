import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import ContentTitle, { ContentTitleProps } from './index'

const initProps: ContentTitleProps = {
  title: '一级内容标题',
  secondaryText: ['二级描述文案 0 - 3段', '二级描述文案-2'],
}

const config: ResourceComponent<ContentTitleProps> = {
  name: '内容标题',
  key: 'conent_title',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/content_title_preview.png',
  category: ComponentCategoryEnum.CONTENT,
  component: ContentTitle,
  props: initProps,
  propsSchema: {
    title: {
      label: '内容标题',
      type: PropTypeEnum.STRING,
    },
    secondaryText: {
      label: '次级文案',
      type: PropTypeEnum.ARRAY,
      minItems: 0,
      maxItems: 3,
      item: {
        type: PropTypeEnum.STRING,
      },
    },
  },
}

export default config
