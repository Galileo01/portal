import * as React from 'react'

import { Collapse, CollapseProps } from '@arco-design/web-react'

import { ConfigPaneBaseProps, ConfigPaneNameEnum } from '../../config'
import ThemeConfig from './theme-config'
import FontConfig from './font-config'

const { Item: CollapseItem } = Collapse

const GlobalConfig: React.FC<ConfigPaneBaseProps> = ({ active }) => {
  const [activeKey, setActiveKey] = React.useState('')

  const handleCollapseChange: CollapseProps['onChange'] = (key) => {
    setActiveKey((pre) => (pre === key ? '' : key))
  }

  React.useEffect(() => {
    // 手动折叠
    if (!active) {
      setActiveKey('')
    }
  }, [active])

  return (
    <CollapseItem
      header="全局配置"
      name={ConfigPaneNameEnum.GLOBAL_CONFIG}
      disabled={!active}
    >
      <Collapse
        activeKey={activeKey}
        lazyload
        bordered={false}
        expandIconPosition="right"
        accordion
        onChange={handleCollapseChange}
      >
        <ThemeConfig />
        <FontConfig />
      </Collapse>
    </CollapseItem>
  )
}

export default GlobalConfig
