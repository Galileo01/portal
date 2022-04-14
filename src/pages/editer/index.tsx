import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { EditerDataProvider } from '@/store/editer-data'
import { FetchDataProvider } from '@/store/fetch-data'

import ToolNav from './components/tool-nav'
import Resource from './components/resource'
import Previewer from './components/previewer'
import Prop from './components/config'
import styles from './index.module.less'

const { Header, Content, Sider } = Layout

const Editer = () => (
  <EditerDataProvider>
    <FetchDataProvider>
      <Layout className={styles.editer_container}>
        <Header>
          <ToolNav />
        </Header>
        <Layout className={styles.content_container}>
          <Resource />
          <Content>
            <Previewer />
          </Content>
          {/* var --props-sider-width */}
          <Sider width={300}>
            <Prop />
          </Sider>
        </Layout>
      </Layout>
    </FetchDataProvider>
  </EditerDataProvider>
)

export default Editer

// export const ProviderWrapperedEditer
