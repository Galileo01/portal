import * as React from 'react'

import { Spin, Message } from '@arco-design/web-react'

import { devLogger } from '@/common/utils'
import { getTemplateList, deleteResourceById } from '@/network/resource'
import {
  TemplateBase,
  GetTemplateListRes,
  GetResourceListQuery,
} from '@/typings/request'
import { useRefreshWhenUserUpdate } from '@/common/hooks/user'
import TemplateTypeRadio from '@/components/template-type-selector'

import styles from './index.module.less'
import ResourceList, {
  ResourceListProps,
  ActionComputer,
  TagComputer,
} from './resource-list'

type Pagination = {
  current: number
  size: number
}

const initPagination: Pagination = {
  current: 1,
  size: 5,
}

const TemplateList = () => {
  const [paginationInfo, setPagination] =
    React.useState<Pagination>(initPagination)

  const [filter, setFilter] =
    React.useState<GetResourceListQuery['filter']>('all')
  const [templateListRes, setPageList] = React.useState<GetTemplateListRes>({
    resourceList: [],
    hasMore: 0,
  })

  const [loading, setLoading] = React.useState(false)

  const fetchTemplateList = React.useCallback(() => {
    const { current, size } = paginationInfo
    const offset = (current - 1) * size

    setLoading(true)

    getTemplateList({
      offset,
      limit: size,
      filter,
    })
      .then((res) => {
        if (res.success) {
          setPageList(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [paginationInfo, filter])

  React.useEffect(() => {
    fetchTemplateList()
  }, [fetchTemplateList])

  const handleRefresh = React.useCallback(() => {
    devLogger('handleRefresh')
    setPagination({ ...initPagination })
  }, [])

  const { userInfo } = useRefreshWhenUserUpdate({
    onRefresh: handleRefresh,
  })

  const hanldeLoadMore = () => {
    setPagination(({ current, size }) => ({
      size,
      current: current + 1,
    }))
  }

  const actionComputer: ActionComputer<TemplateBase> = React.useCallback(
    (resource) => {
      const isOnwer = resource.ownerId === userInfo?.userId
      return {
        edit: isOnwer,
        remove: isOnwer,
        launch: true,
      }
    },
    [userInfo]
  )

  const tagComputer: TagComputer<TemplateBase> = React.useCallback(
    (resource) => {
      const isPrivate = Boolean(resource.private)
      const isOnwer = resource.ownerId === userInfo?.userId

      const tags: Array<{ text: string; color: string }> = [
        {
          text: isPrivate ? '私有' : '共享',
          color: isPrivate ? 'red' : 'blue',
        },
        {
          text: resource.type === 'platform' ? '平台' : '用户',
          color: 'green',
        },
      ]

      if (isOnwer) {
        tags.unshift({
          text: '我的',
          color: 'orange',
        })
      }

      return tags
    },
    [userInfo]
  )

  const handleRemove: ResourceListProps['onRemove'] = (resourceId) => {
    deleteResourceById({
      resourceId,
      resourceType: 'template',
    }).then((res) => {
      if (res.success) {
        Message.success('删除成功')
        fetchTemplateList()
      }
    })
  }

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>模板空间</h1>
      <TemplateTypeRadio value={filter} onChange={setFilter} />
      <Spin
        style={{ display: 'block' }}
        className={styles.template_spin}
        loading={loading}
      >
        <ResourceList
          resourceType="template"
          hasMore={templateListRes.hasMore}
          resourceList={templateListRes.resourceList}
          onLoadMore={hanldeLoadMore}
          onRemove={handleRemove}
          // @ts-ignore
          actionComputer={actionComputer}
          // @ts-ignore
          tagComputer={tagComputer}
        />
      </Spin>
    </section>
  )
}

export default TemplateList
