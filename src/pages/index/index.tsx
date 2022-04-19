import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import NavHeader from './components/nav-header'

const { Header, Content } = Layout

const Index = () => (
  <Layout>
    <Header>
      <NavHeader />
    </Header>
    <Content>Content</Content>
  </Layout>
)

export default Index
