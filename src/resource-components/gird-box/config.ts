import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import GridBox, { GridBoxProps } from './index'

export const initProps: GridBoxProps = {
  gridConfig: {},
  itemList: [
    {
      description: 'description-1',
      img: 'https://zos.alipayobjects.com/rmsportal/chnhazooyzrjWSv.jpg',
    },
    {
      description: 'description-2',
      img: 'https://zos.alipayobjects.com/rmsportal/gyseCGEPqWjQpYF.jpg',
    },
    {
      description: 'description-3',
      img: 'https://s3.bmp.ovh/imgs/2022/04/03/67d8127b695f4e2b.png',
    },
    {
      description: 'description-4',
      img: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    },
    {
      description: 'description-5',
      img: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    },
    {
      description: 'description-7',
      img: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    },
  ],
}

const config: ResourceComponent<GridBoxProps> = {
  name: '网格',
  key: 'grid_box',
  category: ComponentCategoryEnum.CONTENT,
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/grid_box_preview.png',
  component: GridBox,
  props: initProps,
  propsSchema: {
    gridConfig: {
      label: '网格配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        width: {
          label: '容器宽度',
          emptyHint: '默认值1200px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
        itemWidth: {
          label: '单项宽度',
          emptyHint: '默认值300px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
        itemHeight: {
          label: '单项宽度',
          emptyHint: '默认值300px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
        rowGap: {
          label: '行间距',
          emptyHint: '默认值20px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
        columnGap: {
          label: '行间距',
          emptyHint: '默认值20px',
          type: PropTypeEnum.NUMBER,
          unit: 'px',
        },
      },
    },
    itemList: {
      label: '项目列表',
      type: PropTypeEnum.ARRAY,
      minItems: 0,
      maxItems: 9,
      item: {
        type: PropTypeEnum.OBJECT,
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
