import * as React from 'react'

import { Collapse } from '@arco-design/web-react'

import ThemeConfig from './theme-config'

const { Item: CollapseItem } = Collapse

const PageConfig = () => (
  <CollapseItem header="页面配置" name="page_props">
    <ThemeConfig />
  </CollapseItem>
)

export default PageConfig
