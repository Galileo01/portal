import {
  ResourceComponent,
  ComponentCategoryEnum,
} from '@/typings/resosurce-component'

import Nav, { NavProps } from '../nav'

const initProps: NavProps = {
  logoSrc: 'https://zos.alipayobjects.com/rmsportal/gyseCGEPqWjQpYF.jpg',
  navList: [
    {
      title: 'bilibili',
      href: 'https://www.bilibili.com/',
    },
    {
      title: 'weibo',
      href: 'https://www.weibo.com/',
    },
    {
      title: 'MDN',
      href: 'https://developer.mozilla.org/zh-CN/',
    },
  ],
}

export const componentConfig: ResourceComponent = {
  name: '导航_test',
  key: 'nav_test',
  previewImg: 'https://zos.alipayobjects.com/rmsportal/gyseCGEPqWjQpYF.jpg',
  category: ComponentCategoryEnum.NAVIGATION,
  component: Nav as React.FC<unknown>,
  initProps,
  propsSchema: {},
}

export default componentConfig
