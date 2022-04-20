import * as React from 'react'

import { Card, Button } from '@arco-design/web-react'
import { IconMore } from '@arco-design/web-react/icon'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  ResourceBaseInfoList,
  TemplateBaseInfo,
  PageBaseInfo,
} from '@/@types/portal-network'

import styles from './index.module.less'

export type ItemRenderer<T extends TemplateBaseInfo | PageBaseInfo> = (
  resource: T,
  index: number
) => JSX.Element

export type ResourceListProps = {
  className?: string
  resourceList: ResourceBaseInfoList
  hasMore: boolean
  itemRenderer: ItemRenderer<PageBaseInfo>
  onLoadMore: () => void
}

const ResourceList: React.FC<ResourceListProps> = (props) => {
  const { resourceList, hasMore, itemRenderer, onLoadMore, className } = props

  return (
    <div className={className}>
      <TransitionGroup className={styles.resource_list}>
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
              className={styles.load_more}
              cover={
                <div className={styles.load_more_cover}>
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
