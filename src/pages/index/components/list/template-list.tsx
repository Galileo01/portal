import * as React from 'react'

import { Spin, Message } from '@arco-design/web-react'

import { deleteResourceById } from '@/network/resource'
import { TemplateBase, GetResourceListQuery } from '@/typings/request'
import { useRefreshWhenUserUpdate } from '@/common/hooks/user'
import { useFetchResrouceList } from '@/common/hooks/fetch-resource'
import TemplateTypeRadio from '@/components/template-type-selector'

import styles from './index.module.less'
import ResourceList, {
  ResourceListProps,
  ActionComputer,
  TagComputer,
} from './resource-list'

const TemplateList = () => {
  const [filter, setFilter] =
    React.useState<GetResourceListQuery['filter']>('all')

  const {
    loading,
    resourceListRes,
    fetchResourceList,
    hanldeLoadMore,
    handleRefresh,
  } = useFetchResrouceList({ resourceType: 'template', size: 5 })

  React.useEffect(() => {
    fetchResourceList('init')
    // 第一次渲染才请求
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (value: string) => {
    setFilter(value as GetResourceListQuery['filter'])
    fetchResourceList('init', {
      value,
    })
  }

  const { userInfo } = useRefreshWhenUserUpdate({
    onRefresh: handleRefresh,
  })

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
      }
    })
  }

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>模板空间</h1>
      <TemplateTypeRadio value={filter} onChange={handleFilterChange} />
      <Spin
        style={{ display: 'block' }}
        className={styles.template_spin}
        loading={loading}
      >
        <ResourceList
          resourceType="template"
          hasMore={resourceListRes.hasMore}
          resourceList={resourceListRes.resourceList}
          onLoadMore={() => hanldeLoadMore()}
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
