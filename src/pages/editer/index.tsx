import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { EditerDataProvider } from '@/store/editer-data'

import ToolNav from './components/tool-nav'
import Resource from './components/resource'
import Previewer from './components/previewer'
import Prop from './components/prop'
import styles from './index.module.less'

const { Header, Content, Sider } = Layout

const Editer = () => (
  <EditerDataProvider>
    <Layout className={styles.editer_container}>
      <Header>
        <ToolNav />
      </Header>
      <Layout className={styles.content_container}>
        <Resource />
        <Content>
          <Previewer />
        </Content>
        <Sider width={300}>
          <Prop />
        </Sider>
      </Layout>
    </Layout>
  </EditerDataProvider>
)

export default Editer
