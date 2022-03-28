import * as React from 'react'

import {
  ResourceComponent,
  ComponentCategoryEnum,
} from '@/typings/resosurce-component'

import Nav, { NavProps } from './index'

const initProps: NavProps = {
  logoSrc: 'https://zos.alipayobjects.com/rmsportal/chnhazooyzrjWSv.jpg',
  navList: [
    {
      title: 'Baidu-百度',
      href: 'https://www.baidu.com',
    },
    {
      title: 'Github',
      href: 'https://github.com/',
    },
    {
      title: 'Google-谷歌',
      href: 'https://www.google.com/',
    },
  ],
}

export const componentConfig: ResourceComponent = {
  name: '导航',
  key: 'nav',
  previewImg: 'https://zos.alipayobjects.com/rmsportal/chnhazooyzrjWSv.jpg',
  category: ComponentCategoryEnum.NAVIGATION,
  component: Nav as React.FC<unknown>,
  initProps,
  propsSchema: {
    logoSrc: {
      label: 'logo 地址',
      type: 'string',
    },
    navList: {
      type: 'array',
      label: '导航列表',
      maxItems: 6,
      item: {
        type: 'object',
        properties: {
          title: {
            label: '标题',
            type: 'string',
          },
          href: {
            label: '地址',
            type: 'string',
          },
        },
      },
    },
    height: {
      label: '高度',
      type: 'number',
    },
  },
}

export default componentConfig
