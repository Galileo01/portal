import * as React from 'react'

import {
  Timeline as ArcoTimeline,
  TimelineProps as ArcoTimelineProps,
  TimelineItemProps,
} from '@arco-design/web-react'

import { RCClassnameComputer } from '../utils'
import styles from './index.module.less'

const { Item: ArcoTimelineItem } = ArcoTimeline

export type TimelineProps = {
  timelineConfig: {
    direction?: ArcoTimelineProps['direction']
    reverse?: boolean
    mode?: ArcoTimelineProps['mode']
    lineType?: TimelineItemProps['lineType']
  }
  pointList: Array<{
    label: string
    desctiption: string
    dotColor?: string
  }>
}

const Timeline: React.FC<TimelineProps> = (props) => {
  const { timelineConfig, pointList, ...elementProps } = props
  return (
    <div className={RCClassnameComputer({}, styles.timeline)} {...elementProps}>
      <ArcoTimeline {...timelineConfig}>
        {pointList.map((point) => (
          <ArcoTimelineItem
            label={point.label}
            key={point.label}
            dotColor={point.dotColor}
            lineType={timelineConfig.lineType}
          >
            {point.desctiption}
          </ArcoTimelineItem>
        ))}
      </ArcoTimeline>
    </div>
  )
}

export default Timeline
