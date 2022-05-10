import * as React from 'react'

import { Spin, Message } from '@arco-design/web-react'

import { devLogger } from '@/common/utils'
import { getPageList, deleteResourceByid } from '@/network/resource'
import { GetPageListRes, PageBase } from '@/typings/request/resource'
import { useRefreshWhenUpdate } from '@/common/hooks/user'

import styles from './index.module.less'
import ResourceList, {
  ResourceListProps,
  ActionComputer,
} from './resource-list'

type Pagination = {
  current: number
  size: number
}

const initPagination: Pagination = {
  current: 1,
  size: 5,
}

const PageList = () => {
  const [paginationInfo, setPagination] =
    React.useState<Pagination>(initPagination)

  const [pageListRes, setPageList] = React.useState<GetPageListRes>({
    resourceList: [],
    hasMore: 0,
  })

  const [loading, setLoading] = React.useState(false)

  const fetchPageList = React.useCallback(() => {
    const { current, size } = paginationInfo
    const offset = (current - 1) * size
    setLoading(true)

    getPageList({
      offset,
      limit: size,
    })
      .then((res) => {
        if (res.success) {
          setPageList(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [paginationInfo])

  const hanldeLoadMore = () => {
    setPagination(({ current, size }) => ({
      size,
      current: current + 1,
    }))
  }

  const actionsComputer: ActionComputer<PageBase> = () => ({
    edit: true,
    launch: true,
    remove: true,
  })

  const handleRemove: ResourceListProps['onRemove'] = (resourceId) => {
    deleteResourceByid(resourceId).then((res) => {
      if (res.success) {
        Message.success('删除成功')
        fetchPageList()
      }
    })
  }

  React.useEffect(() => {
    fetchPageList()
  }, [fetchPageList])

  const handleRefresh = React.useCallback(() => {
    devLogger('handleRefresh')
    setPagination({ ...initPagination })
  }, [])

  useRefreshWhenUpdate({
    onRefresh: handleRefresh,
  })

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>我的页面</h1>
      <Spin style={{ display: 'block' }} loading={loading}>
        <ResourceList
          hasMore={pageListRes.hasMore}
          resourceList={pageListRes.resourceList}
          onLoadMore={hanldeLoadMore}
          actionComputer={actionsComputer}
          onRemove={handleRemove}
        />
      </Spin>
    </section>
  )
}

export default PageList
