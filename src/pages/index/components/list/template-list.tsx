import * as React from 'react'

import {
  Card,
  Popconfirm,
  Spin,
  Tag,
  Space,
  Radio,
} from '@arco-design/web-react'
import { IconLaunch, IconDelete, IconEdit } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { TemplateBaseInfo, TemplateBaseInfoList } from '@/typings/network'

import mockTemplateList from '@/mock/template-list'
import CustomImage from '@/components/custom-image'
import { devLogger } from '@/common/utils'

import styles from './index.module.less'
import ResourceList, { ItemRenderer } from './resource-list'

const { Meta } = Card
const { Group: RadioGroup } = Radio

export type ActionType = 'edit' | 'launch' | 'delete'

const TemplateList = () => {
  const [templateList, setTemplateList] =
    React.useState<TemplateBaseInfoList>(mockTemplateList)
  const [hasMore, setMore] = React.useState(true)

  const hanldeLoadMore = () => {
    setTemplateList((preList) =>
      preList.concat({
        title: 'page_test-2',
        resourceId: `${Date.now()}`,
        thumbnailUrl:
          'https://zos.alipayobjects.com/rmsportal/gyseCGEPqWjQpYF.jpg',
        private: 1,
        type: 'platform',
        userInfo: {
          name: 'test',
          avatar:
            'https://p3-passport.byteacctimg.com/img/user-avatar/b6de89756bc6f6c3a65e4fc4c0213db7~300x300.image',
        },
      })
    )
    if (templateList.length > 8) {
      setMore(false)
    }
  }

  const actionHandlerGenerator = React.useCallback(
    (index: number, action: ActionType) => () => {
      devLogger('actionHandler', templateList[index], action)
    },
    [templateList]
  )

  const itemRenderer: ItemRenderer<TemplateBaseInfo> = (resource, index) => {
    const isPrivate = Boolean(resource.private)

    const actionsList = [
      <div
        className={styles.action_btn}
        onClick={actionHandlerGenerator(index, 'launch')}
      >
        <IconLaunch />
      </div>,
    ]

    // 用户自己的 模板 才允许 删除和 编辑
    if (isPrivate) {
      actionsList.push(
        <Popconfirm
          title="确认删除该页面?"
          onOk={actionHandlerGenerator(index, 'delete')}
        >
          <div className={clsx(styles.action_btn, styles.delete_icon)}>
            <IconDelete />
          </div>
        </Popconfirm>
      )
      actionsList.unshift(
        <div
          className={styles.action_btn}
          onClick={actionHandlerGenerator(index, 'edit')}
        >
          <IconEdit />
        </div>
      )
    }

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

    return (
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
        actions={actionsList}
      >
        <Meta
          title={resource.title}
          description={
            <Space>
              {tags.map(({ color, text }) => (
                <Tag key={text} color={color}>
                  {text}
                </Tag>
              ))}
            </Space>
          }
        />
      </Card>
    )
  }

  return (
    <section className={styles.page_list_container}>
      <h1 className={styles.title}>模板空间</h1>
      <RadioGroup type="button" defaultValue="all">
        <Radio value="all">全部</Radio>
        <Radio value="private">我的</Radio>
        <Radio value="public">共享</Radio>
        <Radio value="platform">平台</Radio>
      </RadioGroup>
      <Spin style={{ display: 'block' }} className={styles.template_spin}>
        <ResourceList
          hasMore={hasMore}
          resourceList={templateList}
          // @ts-ignore 忽略 对于 函数参数  违反 类型逆变 的报错
          itemRenderer={itemRenderer}
          onLoadMore={hanldeLoadMore}
        />
      </Spin>
    </section>
  )
}

export default TemplateList
