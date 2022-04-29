import clsx, { ClassValue } from 'clsx'

import {
  RESOURCE_COMPONENT_COMMON_CLASS,
  RESOURCE_COMPONENT_WILL_STICKY_CLASS,
  RESOURCE_COMPONENT_ENFORCE_ABSOLUTE_CONTAINER_CLASS,
} from '@/common/constant'

// RC 组件的类名 计算器
export const RCClassnameComputer = (
  wrapperDesc: {
    /**
     * @isRC 是否渲染的为单独的 源组件
     * 某些源组件 被其他 源组件 引用，此时不能渲染为单独的源组件
     * 会影响 props-config 的辅助选中特性
     * 默认 true
     */
    isRC?: boolean
    /**
     * @enforceAbsolute 强制开始容器的 absolute
     * 默认 false
     */
    enforceAbsolute?: boolean
    /**
     * @willSticky 是否将会 变成 sticky 定位
     * 影响 tool-box 对是否监听滚动的 判断
     * 默认值 false
     */
    willSticky?: boolean
  },
  ...classes: ClassValue[]
) => {
  const { isRC = true, enforceAbsolute, willSticky } = wrapperDesc

  const baseClassName: ClassValue[] = [
    isRC && RESOURCE_COMPONENT_COMMON_CLASS,
    enforceAbsolute && RESOURCE_COMPONENT_ENFORCE_ABSOLUTE_CONTAINER_CLASS,
    willSticky && RESOURCE_COMPONENT_WILL_STICKY_CLASS,
  ]

  return clsx(baseClassName.concat(classes))
}

export default RCClassnameComputer
