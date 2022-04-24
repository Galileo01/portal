import * as React from 'react'

import { PLATFORM_LOGO_PUBLIC_URL } from '@/common/constant'
import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import Nav, { NavProps } from './index'

const initProps: NavProps = {
  logoSrc: PLATFORM_LOGO_PUBLIC_URL,
  isSticky: false,
  navList: [
    {
      title: '导航1',
      href: 'https://www.baidu.com',
    },
    {
      title: '导航2',
      href: 'https://www.baidu.com',
    },
    {
      title: '导航3',
      href: 'https://www.baidu.com',
    },
  ],
  height: 60,
}

export const componentConfig: ResourceComponent = {
  name: '导航',
  key: 'nav',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/nav_preview.png',
  category: ComponentCategoryEnum.NAVIGATION,
  component: Nav as React.FC<unknown>,
  props: initProps,
  propsSchema: {
    logoSrc: {
      label: 'logo 地址',
      type: PropTypeEnum.STRING,
    },
    height: {
      label: '高度',
      help: '单位px/为空时传入60px',
      type: PropTypeEnum.NUMBER,
    },
    isSticky: {
      label: '吸顶模式',
      type: PropTypeEnum.BOOLEAN,
    },
    navList: {
      type: PropTypeEnum.ARRAY,
      label: '导航列表',
      maxItems: 10,
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
  },
}

export default componentConfig
