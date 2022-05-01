import {
  ResourceComponent,
  ComponentCategoryEnum,
  PropTypeEnum,
} from '@/typings/common/resosurce-component'

import Timeline, { TimelineProps } from './index'

const initProps: TimelineProps = {
  timelineConfig: {
    mode: 'alternate',
  },
  pointList: [
    {
      label: '2017-03-10',
      desctiption: 'The first milestone',
    },
    {
      label: '2018-05-12',
      desctiption: 'The second milestone',
    },
    {
      label: '2020-09-30',
      desctiption: 'The third milestone',
    },
  ],
}

const config: ResourceComponent<TimelineProps> = {
  name: '时间轴',
  key: 'timeline',
  category: ComponentCategoryEnum.CONTENT,
  previewImg:
    'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/timeline_preview.png',
  component: Timeline,
  props: initProps,
  propsSchema: {
    timelineConfig: {
      label: '时间轴配置',
      type: PropTypeEnum.OBJECT,
      properties: {
        reverse: {
          label: '是否倒序',
          type: PropTypeEnum.BOOLEAN,
        },
        direction: {
          label: '方向',
          type: PropTypeEnum.STRING,
          enums: [
            {
              label: '垂直',
              value: 'vertical',
            },
            {
              label: '水平',
              value: 'horizontal',
            },
          ],
        },
        mode: {
          label: '展示模式',
          type: PropTypeEnum.STRING,
          enums: [
            {
              label: '交替',
              value: 'alternate',
            },
            {
              label: '左(垂直方向生效)',
              value: 'left',
            },
            {
              label: '右(垂直方向生效)',
              value: 'right',
            },
            {
              label: '上(水平方向生效)',
              value: 'top',
            },
            {
              label: '下(水平方向生效)',
              value: 'bottom',
            },
          ],
        },
        lineType: {
          label: '轴线类型',
          type: PropTypeEnum.STRING,
          enums: [
            {
              label: '实线',
              value: 'solid',
            },
            {
              label: '虚线',
              value: 'dashed',
            },
            {
              label: '点状线',
              value: 'dotted',
            },
          ],
        },
      },
    },
    pointList: {
      label: '点位配置',
      type: PropTypeEnum.ARRAY,
      minItems: 2,
      item: {
        type: PropTypeEnum.OBJECT,
        properties: {
          label: {
            label: '时间',
            type: PropTypeEnum.STRING,
          },
          desctiption: {
            label: '描述',
            type: PropTypeEnum.STRING,
          },
          dotColor: {
            label: '圆点颜色',
            type: PropTypeEnum.COLOR,
          },
        },
      },
    },
  },
}

export default config
