import * as React from 'react'

import { Layout } from '@arco-design/web-react'
import { useSearchParams } from 'react-router-dom'

import { EditerDataProvider } from '@/store/editer-data'
import { FetchDataProvider } from '@/store/fetch-data'
import { useResourceInit } from '@/common/hooks/resource-init'
import { EditType } from '@/typings/common/editer'

import ToolNav from './components/tool-nav'
import Resource from './components/resource'
import Previewer from './components/previewer'
import Prop from './components/config'
import styles from './index.module.less'

const { Header, Content, Sider } = Layout

const Editer = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo(
    () => ({
      resource_id: params.get('resource_id') || '',
      edit_type: params.get('edit_type') || EditType.CREATE,
      use_local: Boolean(Number(params.get('use_local'))),
      title: params.get('title') || '',
      resource_type: params.get('resource_type') || 'page',
    }),
    [params]
  )

  useResourceInit({
    resourceId: searchParams.resource_id,
    resourceType: searchParams.resource_type,
    isEditer: true,
    initType:
      searchParams.use_local === true ||
      searchParams.edit_type === EditType.CREATE
        ? 'restore'
        : 'fetch',
  })

  return (
    <Layout className={styles.editer_layout}>
      <Header>
        <ToolNav
          resourceId={searchParams.resource_id}
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
