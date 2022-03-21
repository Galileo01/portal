import React from 'react'

import { Layout, Tabs, Popover } from '@arco-design/web-react'
import { IconCodeSandbox, IconApps } from '@arco-design/web-react/icon'

import useDevLogger from '@/common/hooks/useDevLogger'

import styles from './index.module.less'

import ComponentPane from './components/component-pane'

const { TabPane } = Tabs
const { Sider } = Layout

const Resource = () => {
  const [collapsed, setCollapsed] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('component')

  const devLogger = useDevLogger()

  const handleCollapse = (collapse: boolean) => {
    setCollapsed(collapse)
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

  devLogger('handleTabClick', '666')

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      width={300}
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
            <Popover content="组件" position="right">
              <IconCodeSandbox />
            </Popover>
          }
        >
          <ComponentPane />
        </TabPane>
        <TabPane
          key="template"
          title={
            <Popover content="模板" position="right">
              <IconApps />
            </Popover>
          }
        >
          template
        </TabPane>
      </Tabs>
    </Sider>
  )
}

export default Resource
