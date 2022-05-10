import * as React from 'react'

import {
  Button,
  Space,
  Popover,
  Message,
  Popconfirm,
  Tag,
} from '@arco-design/web-react'
import { IconRedo, IconUndo } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { Link, useSearchParams } from 'react-router-dom'

import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
  MAX_LENGTH,
} from '@/store/editer-data'
import { ROUTE_PAGE } from '@/common/constant/route'
import { setPageConfigById, clearResourceConfig } from '@/common/utils/storage'
import { restorePreviewColorVariable } from '@/common/utils/color-variable'
import { removeFontStyleNode } from '@/common/utils/font'
import { usePrompt } from '@/common/hooks/react-router-dom'
import { devLogger } from '@/common/utils'
import { generateEditerPath } from '@/common/utils/route'
import { operateResource } from '@/network/resource'

import styles from './index.module.less'
import ResourceManage from './components/resource-manage'
import PublishModal, { PublishModalProps } from './components/publish-modal'

export type ToolNavProps = {
  resourceId: string
  editType: string
}

const ToolNav: React.FC<ToolNavProps> = ({ resourceId, editType }) => {
  const [isBlocking, setIsBlocking] = React.useState(true)
  const [modalVisible, setModalVisible] = React.useState(false)

  usePrompt('您还未保存配置，确认离开编辑页么？', isBlocking)

  const {
    snapshotList,
    currentSnapshotIndex,
    componentDataList,
    globalConfig,
    styleConfig,
  } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const [params] = useSearchParams()

  const searchParams = React.useRef({
    resource_type: params.get('resource_type') || 'page',
    edit_type: params.get('edit_type') || 'create',
    title: params.get('title') || undefined,
  })

  const canSnapshotBack = currentSnapshotIndex > 0
  const canSnapshotForward =
    currentSnapshotIndex > -1 && currentSnapshotIndex < snapshotList.length - 1

  const handleSnapshotBack = () => {
    if (canSnapshotBack) {
      editerDataDispatch({
        type: EditerDataActionEnum.BACK,
      })
    }
  }

  const handleSnapshotForward = () => {
    if (canSnapshotForward) {
      editerDataDispatch({
        type: EditerDataActionEnum.FORWARD,
      })
    }
  }

  const handleSaveClick = () => {
    setIsBlocking(false)
    setPageConfigById(resourceId, {
      title: resourceId,
      edit_type: editType,
      globalConfig,
      styleConfig,
      componentDataList,
    })
    Message.success('保存成功')
  }

  const handleClearConfirm = () => {
    editerDataDispatch({
      type: EditerDataActionEnum.CLEAR,
    })
    clearResourceConfig(resourceId)
    restorePreviewColorVariable()
    removeFontStyleNode()
    setIsBlocking(false)
    Message.success('清空成功')
  }

  const showPublishModal = () => {
    setModalVisible(true)
  }

  const hidePublishModal = () => {
    setModalVisible(false)
  }

  const handlePagePublish: PublishModalProps['onConfirm'] = (values) => {
    devLogger('handlePagePublish', values)
    const isPublish = searchParams.current.edit_type === 'create'
    operateResource({
      operateType: isPublish ? 'publish' : 'update',
      resourceData: {
        ...values,
        config: JSON.stringify({
          title: resourceId,
          edit_type: editType,
          globalConfig,
          styleConfig,
          componentDataList,
        }),
      },
    }).then((res) => {
      if (res.success) {
        hidePublishModal()
        clearResourceConfig(resourceId)
        setIsBlocking(false)

        Message.success({
          content: `${isPublish ? '发布' : '更新'}成功`,
          // NOTE: 提示关闭后 根据提交信息 重新计算 地址 强制跳转到 新的地址
          onClose: () => {
            const { resourceType, title } = values

            // FIXME: 等待 官方 修复 bug https://github.com/remix-run/react-router/issues/8245 ,使用 navigator 跳转 页面不刷新问题
            const newHref = generateEditerPath({
              resource_id: resourceId,
              edit_type: 'edit',
              resource_type: resourceType,
              title,
            })
            window.open(newHref, '_self')
          },
        })
      }
    })
  }
  React.useEffect(() => {
    devLogger('currentSnapshotIndex', currentSnapshotIndex)
  }, [currentSnapshotIndex])

  return (
    <section className={styles.tool_bar}>
      <Space size="large">
        <Logo size={50} circle />
        <ResourceManage currentResourceId={resourceId} />
      </Space>
      <Space className={styles.btns} size="medium">
        <ThemeSwitch />
        <IconUndo
          className={clsx(
            styles.snapshot_btn,
            !canSnapshotBack && styles.snapshot_disable
          )}
          onClick={handleSnapshotBack}
        />
        <Popover content={`注意: 最多保存${MAX_LENGTH}个状态快照`}>
          <Tag>{snapshotList.length}</Tag>
        </Popover>
        <IconRedo
          className={clsx(
            styles.snapshot_btn,
            !canSnapshotForward && styles.snapshot_disable
          )}
          onClick={handleSnapshotForward}
        />
        <Link
          to={{
            pathname: ROUTE_PAGE,
            search: `resource_id=${resourceId}&is_preview=1`,
          }}
          target="_blank"
          className={styles.preview_link}
        >
          <Button type="primary">预览</Button>
        </Link>
        <Button onClick={handleSaveClick}>保存</Button>
        <Popconfirm
          onOk={handleClearConfirm}
          title="确定清空当前页面的配置数据?"
        >
          <Button>清空</Button>
        </Popconfirm>
        <Button type="outline">出码</Button>
        <Button type="primary" onClick={showPublishModal}>
          发布
        </Button>
      </Space>
      <PublishModal
        resourceId={resourceId}
        title={searchParams.current.title}
        resourceType={searchParams.current.resource_type}
        visible={modalVisible}
        onCancel={hidePublishModal}
        onConfirm={handlePagePublish}
      />
    </section>
  )
}

export default ToolNav
