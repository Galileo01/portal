import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import Swiper, { SwiperProps } from './index'

const initProps: SwiperProps = {
  swiperConfig: {
    moveSpeed: 500,
    animation: 'slide',
    showArrow: 'always',
    indicatorType: 'dot',
  },
  imgList: [
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
  ],
}

const config: ResourceComponent<SwiperProps> = {
  name: '多图轮播',
  key: 'swiper',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/swiper_preview.png',
  category: ComponentCategoryEnum.BANNER,
  component: Swiper,
  props: initProps,
  propsSchema: {
    imgList: {
      label: '图片列表',
      type: PropTypeEnum.ARRAY,
      item: {
        type: PropTypeEnum.STRING,
      },
    },
    swiperConfig: {
      label: '轮播配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        height: {
          label: '图片高度',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认值240px',
          unit: 'px',
        },
        width: {
          label: '图片宽度',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认值为父容器宽度',
          unit: 'px',
        },
        autoPlay: {
          label: '自动开始',
          type: PropTypeEnum.BOOLEAN,
        },
        moveSpeed: {
          label: '切换速率',
          type: PropTypeEnum.NUMBER,
          help: '默认值500ms',
          unit: 'ms',
        },
        animation: {
          label: '切换动画',
          type: PropTypeEnum.STRING,
          enums: [
            { label: '滑动', value: 'slide' },
            { label: '卡片', value: 'card' },
            { label: '渐隐', value: 'fade' },
          ],
        },
        showArrow: {
          label: '箭头显示',
          type: PropTypeEnum.STRING,
          enums: [
            { label: '一直', value: 'always' },
            { label: 'hover', value: 'hover' },
            { label: '永不', value: 'never' },
          ],
        },
        indicatorType: {
          label: '指示器类型',
          type: PropTypeEnum.STRING,
          enums: [
            { label: '圆点', value: 'dot' },
            {
              label: '线条',
              value: 'line',
            },
            {
              label: '滑条',
              value: 'slider',
            },
          ],
        },
      },
    },
  },
}

export default config
