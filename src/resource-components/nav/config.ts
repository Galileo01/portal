import * as React from 'react'

import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

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
  height: 60,
}

export const componentConfig: ResourceComponent = {
  name: '导航',
  key: 'nav',
  previewImg: 'https://zos.alipayobjects.com/rmsportal/chnhazooyzrjWSv.jpg',
  category: ComponentCategoryEnum.NAVIGATION,
  component: Nav as React.FC<unknown>,
  props: initProps,
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
