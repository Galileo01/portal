import * as React from 'react'

import { Card, Button, Popconfirm, Space, Tag } from '@arco-design/web-react'
import {
  IconMore,
  IconPlus,
  IconLaunch,
  IconDelete,
  IconEdit,
} from '@arco-design/web-react/icon'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import dayjs from 'dayjs'

import CustomImage from '@/components/custom-image'
import { TemplateBase, PageBase, PageBaseList } from '@/typings/request'
import { ResourceType } from '@/typings/database'
import {
  createNewResourcePath,
  generateEditerPath,
  generatePagePath,
} from '@/common/utils/route'

import styles from './index.module.less'

const { Meta } = Card

export type ActionDesc = {
  edit?: boolean
  launch?: boolean
  remove?: boolean
}

export type ActionComputer<T extends TemplateBase | PageBase> = (
  resource: T
) => ActionDesc

export type TagComputer<T extends TemplateBase | PageBase> = (
  resource: T
) => Array<{ text: string; color: string }>

export type ResourceListProps = {
  className?: string
  actionComputer: ActionComputer<PageBase>
  tagComputer?: TagComputer<PageBase>
  resourceList: PageBaseList
  hasMore: 0 | 1
  resourceType: ResourceType
  onLoadMore: () => void
  onRemove: (resourceId: string) => void
}

const ResourceList: React.FC<ResourceListProps> = (props) => {
  const {
    resourceList,
    hasMore,
    className,
    resourceType,
    actionComputer,
    tagComputer,
    onLoadMore,
    onRemove,
  } = props

  const newPathRef = React.useRef(createNewResourcePath(resourceType))

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
            <Link to={newPathRef.current}>
              <Button type="primary">创建</Button>
            </Link>
          </Card>
        </CSSTransition>
        {resourceList.map((resource) => {
          const { edit, launch, remove } = actionComputer(resource)
          const tags = tagComputer?.(resource) || []
          const actions: JSX.Element[] = []
          if (edit) {
            actions.push(
              <Link
                target="_blank"
                className={styles.action_btn}
                to={generateEditerPath({
                  resource_id: resource.resourceId,
                  resource_type: resourceType,
                  edit_type: 'edit',
                })}
              >
                <IconEdit />
              </Link>
            )
          }

          if (launch) {
            actions.push(
              <Link
                className={styles.action_btn}
                target="_blank"
                to={generatePagePath({
                  resource_id: resource.resourceId,
                  resource_type: resourceType,
                })}
              >
                <IconLaunch />
              </Link>
            )
          }

          if (remove) {
            actions.push(
              <Popconfirm
                title="确认删除该页面?"
                onOk={() => {
                  onRemove(resource.resourceId)
                }}
              >
                <div className={clsx(styles.action_btn, styles.delete_icon)}>
                  <IconDelete />
                </div>
              </Popconfirm>
            )
          }

          return (
            <CSSTransition
              key={resource.resourceId}
              timeout={{
                enter: 400,
                exit: 100,
              }}
            >
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
                actions={actions}
              >
                <Meta
                  title={resource.title}
                  description={
                    <div>
                      <Space>
                        {tags.map(({ color, text }) => (
                          <Tag key={text} color={color}>
                            {text}
                          </Tag>
                        ))}
                      </Space>
                      <div className={clsx('tip_text', styles.time)}>
                        {dayjs(resource.lastModified).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </CSSTransition>
          )
        })}
        {Boolean(hasMore) && (
          <CSSTransition
            key="load_more"
            timeout={{
              enter: 400,
              exit: 100,
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
