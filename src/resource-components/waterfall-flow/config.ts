import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import WaterFallFlow, { WaterFallFlowProps } from './index'

const initProps: WaterFallFlowProps = {
  flowConfig: {},
  itemList: [
    {
      description: 'description-1',
      img: 'http://5b0988e595225.cdn.sohucs.com/images/20180625/e08f83b039604c10a4d7c0acfa8a2d82.jpeg',
    },
    {
      description: 'description-2',
      img: 'http://n.sinaimg.cn/sinacn/384/w2048h1536/20180408/3956-fyvtmxe0584603.png',
    },
    {
      description: 'description-3',
      img: 'http://bpic.588ku.com//original_origin_min_pic/19/07/20/403240491d13709e323d8c036141dbb1.jpg',
    },
    {
      description: 'description-4',
      img: 'https://img.zcool.cn/community/01a3075c23bebfa8012029acb0a9ce.jpg@1280w_1l_2o_100sh.jpg',
    },
    {
      description: 'description-5',
      img: 'http://photo.tuchong.com/16708324/f/1211371517.jpg',
    },
    {
      description: 'description-7',
      img: 'http://img95.699pic.com/photo/50072/4782.jpg_wh300.jpg!/fh/300//quality/90',
    },
    {
      description: 'description-8',
      img: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1404/11/c9/33038639_1397219151502_mthumb.jpg',
    },
    {
      description: 'description-9',
      img: 'http://photo.tuchong.com/1446893/f/881857711.jpg',
    },
  ],
}

const config: ResourceComponent<WaterFallFlowProps> = {
  name: '瀑布流',
  key: 'waterfall_flow',
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/waterfall_flow_preview.png',
  category: ComponentCategoryEnum.CONTENT,
  component: WaterFallFlow,
  props: initProps,
  propsSchema: {
    flowConfig: {
      label: '瀑布流配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        containerWidth: {
          label: '容器宽度',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
          emptyHint: '默认为容器宽度',
        },
        column: {
          label: '列数',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认4列',
        },
        columnGap: {
          label: '列间距',
          type: PropTypeEnum.NUMBER,
          emptyHint: '默认10px',
          unit: 'px',
        },
      },
    },
    itemList: {
      label: '项目列表',
      type: PropTypeEnum.ARRAY,
      item: {
        type: PropTypeEnum.OBJECT,
        minItems: 4,
        properties: {
          img: {
            label: '图片链接',
            type: PropTypeEnum.STRING,
          },
          description: {
            label: '描述文案',
            type: PropTypeEnum.STRING,
          },
        },
      },
    },
  },
}

export default config
