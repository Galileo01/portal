import * as React from 'react'

import { ComponentDataList } from '@/typings/common/editer'
import { RCList } from '@/resource-components'

export type RCListRendererProps = {
  componentDataList: ComponentDataList
  onDragStart?: React.DragEventHandler<HTMLElement>
  isEditer?: boolean
}

const RCListRenderer: React.FC<RCListRendererProps> = ({
  componentDataList,
  onDragStart,
  isEditer,
}) => (
  <>
    {componentDataList.map((component) => {
      const { id, resourceComponent } = component

      let elementProps = resourceComponent.props
      // 由于 保存到storage 时  组件无法序列化 ，所以 恢复时可能 component 字段为空 ，补救方法 从 RCList 查找
      const Component =
        resourceComponent.component ||
        RCList.find((com) => com.key === component.resourceComponent.key)
          ?.component

      /* 在 editer 路由 下  需要  添加用到的 属性
       * id :用于 计算 下标
       * draggable 允许 拖拽
       */
      if (isEditer) {
        elementProps = {
          ...elementProps,
          isEditer: true,
          draggable: true,
          onDragStart,
        }
      }
      return <Component key={id} id={id} {...elementProps} />
    })}
  </>
)

export default RCListRenderer
