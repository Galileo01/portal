import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import Footer, { FooterProps } from './index'

const initProps: FooterProps = {
  text: '@copyright by Mark',
}

const config: ResourceComponent<FooterProps> = {
  name: '页脚',
  key: 'footer',
  category: ComponentCategoryEnum.FOOTER,
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/footer.png',
  component: Footer,
  props: initProps,
  propsSchema: {
    text: {
      label: '页脚文案',
      type: PropTypeEnum.STRING,
    },
  },
}

export default config
