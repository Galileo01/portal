import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { EditerDataProvider } from '@/store/editer-data'

import ToolBar from './components/tool-bar'
import Resource from './components/resource'
import Previewer from './components/previewer'
import Prop from './components/prop'
import styles from './index.module.less'

const { Header, Content, Sider } = Layout

const Editer = () => (
  <EditerDataProvider>
    <Layout className={styles.editer_container}>
      <Header>
        <ToolBar />
      </Header>
      <Layout className={styles.content_container}>
        <Resource />
        <Content>
          <Previewer />
        </Content>
        <Sider>
          <Prop />
        </Sider>
      </Layout>
    </Layout>
  </EditerDataProvider>
)

export default Editer
