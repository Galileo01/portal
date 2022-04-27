import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import VideoBanner, { VideoBannerProps } from './index'
import contenTitleComponentConfig from '../content_title/config'

const initProps: VideoBannerProps = {
  videoConfig: {
    src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    poster: 'https://www.helloimg.com/images/2022/04/25/Rl3dJv.png',
    controls: true,
  },
  title: '演示视频',
  secondaryText: ['支持视频插入、封面、控制控件的显示、自动播放、循环播放'],
}

const config: ResourceComponent<VideoBannerProps> = {
  name: '视频',
  key: 'video',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/video_preview.png',
  category: ComponentCategoryEnum.BANNER,
  component: VideoBanner,
  props: initProps,
  propsSchema: {
    videoConfig: {
      label: '视频配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        src: {
          label: '视频地址',
          type: PropTypeEnum.STRING,
        },
        poster: {
          label: '封面',
          type: PropTypeEnum.STRING,
        },
        height: {
          label: '容器高度',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认值300px',
          unit: 'px',
        },
        width: {
          label: '容器宽度',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认值为400px',
          unit: 'px',
        },
        controls: {
          label: '显示控件',
          type: PropTypeEnum.BOOLEAN,
        },
        autoPlay: {
          label: '自动播放',
          type: PropTypeEnum.BOOLEAN,
        },
        loop: {
          label: '循环播放',
          type: PropTypeEnum.BOOLEAN,
        },
      },
    },
    ...contenTitleComponentConfig.propsSchema,
  },
}

export default config
