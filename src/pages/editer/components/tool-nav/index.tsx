import * as React from 'react'

import { Button, Space, Popover, Message, Modal } from '@arco-design/web-react'
import { IconRedo, IconUndo, IconInfoCircle } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { useSearchParams, useHref } from 'react-router-dom'

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

const ToolNav = () => {
  const [params] = useSearchParams()

  const pageIdRef = React.useRef(params.get('page_id') || '')

  const href = useHref(
    `${ROUTE_PAGE}?page_id=${pageIdRef.current}&is_preview=1`
  )
  const [isBlocking, setIsBlocking] = React.useState(true)

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

  const handlePreviewClick = () => {
    window.open(href, '_blank')
  }

  const handleSaveClick = () => {
    setIsBlocking(false)
    setPageConfigById(pageIdRef.current, {
      globalConfig,
      styleConfig,
      componentDataList,
    })
    Message.success('保存成功')
  }

  const handleClearClick = () => {
    Modal.confirm({
      title: '此操作会清空编辑器的数据，确认要清空么？',
      onOk: () => {
        editerDataDispatch({
          type: EditerDataActionEnum.CLEAR,
        })
        clearPageConfig(pageIdRef.current)
        restorePreviewColorVariable()
        removeFontStyleNode()
        setIsBlocking(false)
      },
    })
  }

  return (
    <section className={styles.tool_bar}>
      <Logo size={50} className={styles.circle_logo} />
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
        <Button type="primary" onClick={handlePreviewClick}>
          预览
        </Button>
        <Button onClick={handleSaveClick}>保存</Button>
        <Button onClick={handleClearClick}>清空</Button>
        <Button type="outline">出码</Button>
        <Button type="primary">发布</Button>
      </Space>
    </section>
  )
}

export default ToolNav
