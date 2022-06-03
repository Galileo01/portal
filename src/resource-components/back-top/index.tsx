import * as React from 'react'

import clsx from 'clsx'

import { BackTop as ArcoBackTop } from '@arco-design/web-react'

import {
  ARCO_LAYOUT_CONTENT_CLASS,
  RESOURCE_COMPONENT_ENFORCE_ABSOLUTE_CONTAINER_CLASS,
  NONE_POINTER_EVENTS_CONTAINER,
} from '@/common/constant'

import { RCClassnameComputer } from '../utils'

export type BackTopProps = {
  isEditer?: boolean
  visibleHeight?: number
  duration?: number
}

const BackTop: React.FC<BackTopProps> = (props) => {
  const {
    isEditer = false,
    visibleHeight = 30,
    duration = 400,
    ...elementProps
  } = props

  return (
    <div {...elementProps} className={RCClassnameComputer({})}>
      <ArcoBackTop
        className={clsx(
          RESOURCE_COMPONENT_ENFORCE_ABSOLUTE_CONTAINER_CLASS,
          NONE_POINTER_EVENTS_CONTAINER
        )}
        visibleHeight={visibleHeight}
        duration={duration}
        target={
          isEditer
            ? () =>
                document.querySelector(
                  `.${ARCO_LAYOUT_CONTENT_CLASS}`
                ) as HTMLElement
            : undefined
        }
      />
    </div>
  )
}

export default BackTop
