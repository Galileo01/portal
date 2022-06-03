import * as React from 'react'

import { Spin, Message } from '@arco-design/web-react'

import { deleteResourceById } from '@/network/resource'
import { PageBase } from '@/typings/request/resource'
import { useRefreshWhenUserUpdate } from '@/common/hooks/user'
import { useFetchResrouceList } from '@/common/hooks/fetch-resource'
import { generatePagePath } from '@/common/utils/route'

import styles from './index.module.less'
import ResourceList, {
  ResourceListProps,
  ActionComputer,
} from './resource-list'

const PageList = () => {
  const {
    loading,
    resourceListRes,
    fetchResourceList,
    hanldeLoadMore,
    handleRefresh,
  } = useFetchResrouceList({ resourceType: 'page', size: 5 })

  const actionsComputer: ActionComputer<PageBase> = () => ({
    edit: true,
    launch: true,
    remove: true,
  })

  const handleRemove: ResourceListProps['onRemove'] = (resourceId) => {
    deleteResourceById({
      resourceId,
    }).then((res) => {
      if (res.success) {
        Message.success('删除成功')
        fetchResourceList('init')
      }
    })
  }

  const handlePathCopy: ResourceListProps['onPathCopy'] = (resourceId) => {
    const path = generatePagePath(
      {
        resource_id: resourceId,
        resource_type: 'page',
      },
      true
    )
    navigator.clipboard.writeText(path).then(() => {
      Message.success('复制成功')
    })
  }

  React.useEffect(() => {
    fetchResourceList('init')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRefreshWhenUserUpdate({
    onRefresh: handleRefresh,
  })

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>我的页面</h1>
      <Spin style={{ display: 'block' }} loading={loading}>
        <ResourceList
          resourceType="page"
          hasMore={resourceListRes.hasMore}
          resourceList={resourceListRes.resourceList}
          onLoadMore={() => hanldeLoadMore()}
          actionComputer={actionsComputer}
          onRemove={handleRemove}
          onPathCopy={handlePathCopy}
        />
      </Spin>
    </section>
  )
}

export default PageList
