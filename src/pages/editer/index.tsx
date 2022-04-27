import * as React from 'react'

import { Layout } from '@arco-design/web-react'

import { EditerDataProvider } from '@/store/editer-data'
import { FetchDataProvider } from '@/store/fetch-data'
import { usePageInit } from '@/common/hooks/page-init'
import { useEditerParams } from '@/common/hooks/route'

import ToolNav from './components/tool-nav'
import Resource from './components/resource'
import Previewer from './components/previewer'
import Prop from './components/config'
import styles from './index.module.less'

const { Header, Content, Sider } = Layout
// TODO: 结合 服务端 完成出码能力
const Editer = () => {
  const { searchParams } = useEditerParams()

  usePageInit({
    pageId: searchParams.page_id,
    isEditer: true,
    initType:
      searchParams.use_local === true || searchParams.edit_type === 'create'
        ? 'restore'
        : 'fetch',
  })

  return (
    <Layout className={styles.editer_layout}>
      <Header>
        <ToolNav
          pageId={searchParams.page_id}
          editType={searchParams.edit_type}
        />
      </Header>
      <Layout className={styles.content_layout}>
        <Resource />
        <Content className={styles.content_container}>
          <Previewer />
        </Content>
        {/*  width 和 变量 var --props-sider-width  保持一致 */}
        <Sider width={300}>
          <Prop />
        </Sider>
      </Layout>
    </Layout>
  )
}

export const ProviderWrapperedEditer = () => (
  <EditerDataProvider>
    <FetchDataProvider>
      <Editer />
    </FetchDataProvider>
  </EditerDataProvider>
)

export default ProviderWrapperedEditer
