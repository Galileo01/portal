import * as React from 'react'

import { Button, Space, Popover, Message, Modal } from '@arco-design/web-react'
import { IconRedo, IconUndo, IconInfoCircle } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
  MAX_LENGTH,
} from '@/store/editer-data'
import { ROUTE_PAGE } from '@/common/constant/route'
import { setPageConfigById, clearPageConfig } from '@/common/utils/storage'
import { restorePreviewColorVariable } from '@/common/utils/color-variable'
import { removeFontStyleNode } from '@/common/utils/font'
import { usePrompt } from '@/common/hooks/react-router-dom'

import styles from './index.module.less'
import PageManage from './components/page-manage'
import PublishModal, { PublishModalProps } from './components/publish-modal'
import { devLogger } from '@/common/utils'

/* TODO: 
3. 发布时 对预览容器进行截图
*/

export type ToolNavProps = {
  pageId: string
  editType: string
}

const ToolNav: React.FC<ToolNavProps> = ({ pageId, editType }) => {
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
    setPageConfigById(pageId, {
      title: pageId,
      edit_type: editType,
      globalConfig,
      styleConfig,
      componentDataList,
    })
    Message.success('保存成功')
  }

  const handleClearClick = () => {
    Modal.confirm({
      title: '此操作会清空当前页面的配置数据，确认要清空么？',
      onOk: () => {
        editerDataDispatch({
          type: EditerDataActionEnum.CLEAR,
        })
        clearPageConfig(pageId)
        restorePreviewColorVariable()
        removeFontStyleNode()
        setIsBlocking(false)
      },
    })
  }

  const showPublishModal = () => {
    setModalVisible(true)
  }

  const hidePublishModal = () => {
    setModalVisible(false)
  }

  // TODO: 发布 成功 清空本地 对应存储
  const handlePagePublish: PublishModalProps['onConfirm'] = (values) => {
    devLogger('handlePagePublish', values)
    hidePublishModal()
  }

  return (
    <section className={styles.tool_bar}>
      <Space size="large">
        <Logo size={50} circle />
        <PageManage currentPageId={pageId} />
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
          <IconInfoCircle className={styles.snapshot_btn} />
        </Popover>
        <IconRedo
          className={clsx(
            styles.snapshot_btn,
            !canSnapshotForward && styles.snapshot_disable
          )}
          onClick={handleSnapshotForward}
        />
        <Button type="primary">
          <Link
            to={{
              pathname: ROUTE_PAGE,
              search: `page_id=${pageId}&is_preview=1`,
            }}
            target="_blank"
            className={styles.preview_link}
          >
            预览
          </Link>
        </Button>
        <Button onClick={handleSaveClick}>保存</Button>
        <Button onClick={handleClearClick}>清空</Button>
        <Button type="outline">出码</Button>
        <Button type="primary" onClick={showPublishModal}>
          发布
        </Button>
      </Space>
      <PublishModal
        pageId={pageId}
        visible={modalVisible}
        onCancel={hidePublishModal}
        onConfirm={handlePagePublish}
      />
    </section>
  )
}

export default ToolNav
