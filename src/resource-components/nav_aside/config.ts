import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import NavAside, { NavAsideProps } from './index'

const initProps: NavAsideProps = {
  top: '50%',
  position: 'right',
  scrollSmooth: false,
  titleMode: 'text',
  navList: [
    {
      title: '导航1',
      id: 'nav_1',
    },
    {
      title: '元素1',
      id: 'ele_1',
    },
    {
      title: '元素2',
      id: 'ele_2',
    },
  ],
}

export const componentConfig: ResourceComponent = {
  name: '侧边导航',
  key: 'nav_aside',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/nav_aside_preview.png',
  category: ComponentCategoryEnum.NAVIGATION,
  component: NavAside as React.FC<unknown>,
  props: initProps,
  propsSchema: {
    top: {
      type: PropTypeEnum.STRING,
      label: '顶部距离',
      help: '为空默认传入50%',
    },
    position: {
      type: PropTypeEnum.STRING,
      label: '位置',
      enums: [
        {
          label: '右侧',
          value: 'right',
        },
        {
          label: '左侧',
          value: 'left',
        },
      ],
    },
    titleMode: {
      type: PropTypeEnum.STRING,
      label: '标题模式',
      help: '导航项显示为文字or图片',
      enums: [
        {
          label: '文本',
          value: 'text',
        },
        {
          label: '图片',
          value: 'img',
        },
      ],
    },
    scrollSmooth: {
      type: PropTypeEnum.BOOLEAN,
      label: '平滑滚动',
      help: '打开使得页面的滚动更加舒适平滑',
    },
    navList: {
      type: PropTypeEnum.ARRAY,
      label: '导航列表',
      help: '元素id:填入您给其他元素绑定给的id',
      maxItems: 5,
      minItems: 3,
      item: {
        type: PropTypeEnum.OBJECT,
        properties: {
          title: {
            label: '标题',
            type: PropTypeEnum.STRING,
          },
          id: {
            label: '元素id',
            type: PropTypeEnum.STRING,
          },
        },
      },
    },
  },
}

export default componentConfig
