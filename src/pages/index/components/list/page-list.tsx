import * as React from 'react'

import { Card, Popconfirm, Spin } from '@arco-design/web-react'
import { IconLaunch, IconDelete, IconEdit } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { PageBaseList } from '@/typings/request'

import mockPageList from '@/mock/page-list'
import CustomImage from '@/components/custom-image'
import { devLogger } from '@/common/utils'

import styles from './index.module.less'
import ResourceList, { ResourceListProps } from './resource-list'

const { Meta } = Card

export type ActionType = 'edit' | 'launch' | 'delete'

const PageList = () => {
  const [pageList, setPageList] = React.useState<PageBaseList>(mockPageList)
  const [hasMore, setMore] = React.useState(true)

  const hanldeLoadMore = () => {
    if (pageList.length > 8) {
      setMore(false)
    }
  }

  const actionHandlerGenerator = React.useCallback(
    (index: number, action: ActionType) => () => {
      devLogger('actionHandler', pageList[index], action)
    },
    [pageList]
  )

  const itemRenderer: ResourceListProps['itemRenderer'] = (resource, index) => (
    <Card
      key={resource.resourceId}
      hoverable
      cover={
        <CustomImage
          src={resource.thumbnailUrl}
          width="100%"
          height={120}
          preview={false}
        />
      }
      className={styles.resource_item}
      actions={[
        <div
          className={styles.action_btn}
          onClick={actionHandlerGenerator(index, 'edit')}
        >
          <IconEdit />
        </div>,
        <div
          className={styles.action_btn}
          onClick={actionHandlerGenerator(index, 'launch')}
        >
          <IconLaunch />
        </div>,
        <Popconfirm
          title="确认删除该页面?"
          onOk={actionHandlerGenerator(index, 'delete')}
        >
          <div className={clsx(styles.action_btn, styles.delete_icon)}>
            <IconDelete />
          </div>
        </Popconfirm>,
      ]}
    >
      <Meta title={resource.title} />
    </Card>
  )

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>我的页面</h1>
      <Spin style={{ display: 'block' }}>
        <ResourceList
          hasMore={hasMore}
          resourceList={pageList}
          itemRenderer={itemRenderer}
          onLoadMore={hanldeLoadMore}
        />
      </Spin>
    </section>
  )
}

export default PageList
