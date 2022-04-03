import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
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
  props: {
    ...initProps,
    size: 'default',
  },
  propsSchema: {
    navList: {
      type: PropTypeEnum.ARRAY,
      label: '导航列表',
      maxItems: 3,
      minItems: 3,
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
    size: {
      type: PropTypeEnum.STRING,
      label: '大小',
      enums: [
        {
          label: 'default',
          value: 'default',
        },
        {
          label: 'mini',
          value: 'mini',
        },
        {
          label: 'large',
          value: 'large',
        },
      ],
    },
    visible: {
      label: '是否可见',
      type: PropTypeEnum.BOOLEAN,
    },
  },
}

export default componentConfig
