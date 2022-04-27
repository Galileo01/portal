import clsx, { ClassValue } from 'clsx'

import {
  RESOURCE_COMPONENT_COMMON_CLASS,
  RESOURCE_COMPONENT_WILL_STICKY_CLASS,
  RESOURCE_COMPONENT_ABSOLUTE_CONTAINER_CLASS,
} from '@/common/constant'

// RC 组件的类名 计算器
export const RCClassnameComputer = (
  wrapperDesc: {
    absolute?: boolean
    willSticky?: boolean
  },
  ...classes: ClassValue[]
) => {
  const baseClassName: ClassValue[] = [
    RESOURCE_COMPONENT_COMMON_CLASS,
    wrapperDesc?.absolute && RESOURCE_COMPONENT_ABSOLUTE_CONTAINER_CLASS,
    wrapperDesc?.willSticky && RESOURCE_COMPONENT_WILL_STICKY_CLASS,
  ]

  return clsx(baseClassName.concat(classes))
}

export default RCClassnameComputer
