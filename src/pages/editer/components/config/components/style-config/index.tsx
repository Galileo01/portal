import * as React from 'react'

import { Collapse } from '@arco-design/web-react'

const { Item: CollapseItem } = Collapse

const StyleConfig = () => (
  <CollapseItem header="样式配置" name="style_config">
    <CollapseItem header="属性1" name="prop1">
      Beijing Toutiao Technology Co., Ltd.
    </CollapseItem>
  </CollapseItem>
)

export default StyleConfig
