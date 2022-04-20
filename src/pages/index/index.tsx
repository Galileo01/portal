import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import NavHeader from './components/nav-header'
import Introduce from './components/introduce'
import PageList from './components/list/page-list'
import TemplateList from './components/list/template-list'

import styles from './index.module.less'

const { Header, Content } = Layout

const Index = () => (
  <Layout>
    <Header>
      <NavHeader />
    </Header>
    <Content className={styles.content}>
      <Introduce />
      <PageList />
      <TemplateList />
    </Content>
  </Layout>
)

export default Index
