import * as React from 'react'

import { Spin, Radio, Message } from '@arco-design/web-react'

import { devLogger } from '@/common/utils'
import { getTemplateList, deleteResourceById } from '@/network/resource'
import {
  TemplateBase,
  GetTemplateListRes,
  GetResourceListQuery,
} from '@/typings/request'
import { useRefreshWhenUpdate } from '@/common/hooks/user'

import styles from './index.module.less'
import ResourceList, {
  ResourceListProps,
  ActionComputer,
  TagComputer,
} from './resource-list'

const { Group: RadioGroup } = Radio

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

  const hanldeLoadMore = () => {
    setPagination(({ current, size }) => ({
      size,
      current: current + 1,
    }))
  }

  const actionComputer: ActionComputer<TemplateBase> = React.useCallback(
    (resource) => {
      const isPrivate = Boolean(resource.private)
      return {
        edit: isPrivate,
        remove: isPrivate,
        launch: true,
      }
    },
    []
  )

  const tagComputer: TagComputer<TemplateBase> = (resource) => {
    const isPrivate = Boolean(resource.private)

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
    return tags
  }

  const handleRemove: ResourceListProps['onRemove'] = (resourceId) => {
    deleteResourceById(resourceId).then((res) => {
      if (res.success) {
        Message.success('删除成功')
        fetchTemplateList()
      }
    })
  }

  React.useEffect(() => {
    fetchTemplateList()
  }, [fetchTemplateList])

  const handleRefresh = React.useCallback(() => {
    devLogger('handleRefresh')
    setPagination({ ...initPagination })
  }, [])

  useRefreshWhenUpdate({
    onRefresh: handleRefresh,
  })

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>模板空间</h1>
      <RadioGroup type="button" value={filter} onChange={setFilter}>
        <Radio value="all">全部</Radio>
        <Radio value="private">我的</Radio>
        <Radio value="public">共享</Radio>
        <Radio value="platform">平台</Radio>
      </RadioGroup>
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
