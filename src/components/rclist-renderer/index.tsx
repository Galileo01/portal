import * as React from 'react'

import { ComponentDataList } from '@/typings/editer'
import { IS_ROUTE_EDITER } from '@/common/utils'

export type RCListRendererProps = {
  RCList: ComponentDataList
  onDragStart?: React.DragEventHandler<HTMLElement>
}

const RCListRenderer: React.FC<RCListRendererProps> = ({
  RCList,
  onDragStart,
}) => (
  <>
    {RCList.map((component) => {
      const { id, resourceComponent } = component

      let restProps = resourceComponent.props

      /* 在 editer 路由 下  需要  添加用到的 属性
       * id :用于 计算 下标
       * draggable 允许 拖拽
       */
      if (IS_ROUTE_EDITER) {
        restProps = {
          ...restProps,
          id,
          draggable: true,
          onDragStart,
        }
      }
      return <resourceComponent.component key={id} {...restProps} />
    })}
  </>
)

export default RCListRenderer
