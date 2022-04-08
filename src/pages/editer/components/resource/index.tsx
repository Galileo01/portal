import * as React from 'react'

import { Layout, Tabs, Tooltip } from '@arco-design/web-react'
import { IconCodeSandbox, IconApps } from '@arco-design/web-react/icon'

import { LOSTORAGE_KEY_IS_SIDER_COLLAPSE } from '@/common/constant'
import { getLocalStorage, setLocalStorage } from '@/common/utils/storage'

import ComponentPane from './components/component-pane'
import styles from './index.module.less'

const { TabPane } = Tabs
const { Sider } = Layout

const Resource = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('component')

  const handleCollapse = (collapse: boolean) => {
    setCollapsed(collapse)
    setLocalStorage(LOSTORAGE_KEY_IS_SIDER_COLLAPSE, collapse ? '1' : '')
  }

  const handleTabClick = (key: string) => {
    setActiveTab(key)
    // 点击当前 tab ，折叠面板
    if (key === activeTab && !collapsed) {
      setCollapsed(true)
      return
    }
    // 其他情况  展开面板
    if (collapsed && activeTab) {
      setCollapsed(false)
    }
  }

  React.useEffect(() => {
    const isCollapseInStorage = getLocalStorage(LOSTORAGE_KEY_IS_SIDER_COLLAPSE)
    setCollapsed(Boolean(isCollapseInStorage) || false)
  }, [])

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      // --resource-sider-width
      width={350}
    >
      <Tabs
        direction="vertical"
        activeTab={activeTab}
        className={styles.resource_tabs}
        onClickTab={handleTabClick}
      >
        <TabPane
          key="component"
          title={
            <Tooltip content="组件" position="right" mini>
              <IconCodeSandbox />
            </Tooltip>
          }
        >
          <ComponentPane />
        </TabPane>
        <TabPane
          key="template"
          title={
            <Tooltip content="模板" position="right" mini>
              <IconApps />
            </Tooltip>
          }
        >
          template
        </TabPane>
      </Tabs>
    </Sider>
  )
}

export default Resource
