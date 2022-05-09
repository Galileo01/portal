import * as React from 'react'

import { Card, Button } from '@arco-design/web-react'
import { IconMore, IconPlus } from '@arco-design/web-react/icon'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { TemplateBase, PageBase, PageBaseList } from '@/typings/request'

import { createNewEditerPath } from '@/common/utils/route'

import styles from './index.module.less'

export type ItemRenderer<T extends TemplateBase | PageBase> = (
  resource: T,
  index: number
) => JSX.Element

export type ResourceListProps = {
  className?: string
  resourceList: PageBaseList
  hasMore: boolean
  itemRenderer: ItemRenderer<PageBase>
  onLoadMore: () => void
}

const ResourceList: React.FC<ResourceListProps> = (props) => {
  const { className, resourceList, hasMore, itemRenderer, onLoadMore } = props

  const navigator = useNavigate()

  const handleCreateClick = () => {
    const newEditerPath = createNewEditerPath()
    navigator(newEditerPath)
  }

  return (
    <div className={className}>
      <TransitionGroup className={styles.resource_list}>
        <CSSTransition
          key="create"
          timeout={{
            enter: 400,
            exit: 300,
          }}
        >
          <Card
            hoverable
            className={clsx(styles.resource_item, styles.function_item)}
            cover={
              <div className={styles.function_item_cover}>
                <IconPlus />
              </div>
            }
          >
            <Button onClick={handleCreateClick} type="primary">
              创建
            </Button>
          </Card>
        </CSSTransition>
        {resourceList.map((resource, index) => (
          <CSSTransition
            key={resource.resourceId}
            timeout={{
              enter: 400,
              exit: 300,
            }}
          >
            {itemRenderer(resource, index)}
          </CSSTransition>
        ))}
        {hasMore && (
          <CSSTransition
            key="load_more"
            timeout={{
              enter: 400,
              exit: 300,
            }}
          >
            <Card
              hoverable
              className={clsx(styles.resource_item, styles.function_item)}
              cover={
                <div className={styles.function_item_cover}>
                  <IconMore />
                </div>
              }
            >
              <Button onClick={onLoadMore}>加载更多</Button>
            </Card>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  )
}

export default ResourceList
