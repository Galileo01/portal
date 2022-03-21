import React from 'react'

import { Button, Space } from '@arco-design/web-react'
import { IconRedo, IconUndo } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { useSearchParams, useHref } from 'react-router-dom'

import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
} from '@/store/editer-data'
import { ROUTE_PAGE } from '@/common/constant/route'
import useDevLogger from '@/common/hooks/useDevLogger'

import styles from './index.module.less'

const ToolBar = () => {
  const [params] = useSearchParams()
  const href = useHref(
    `${ROUTE_PAGE}?page_id=${params.get('page_id')}&is_preview=1`
  )

  const devLogger = useDevLogger('tool-bar')

  const { snapshotList, currentSnapshotIndex } = useEditerDataStore()
  const editDataDispatch = useEditerDataDispatch()

  const canSnapshotBack = currentSnapshotIndex > 0
  const canSnapshotForward =
    currentSnapshotIndex > 0 && currentSnapshotIndex < snapshotList.length - 1

  const handleSnapshotBack = () => {
    if (canSnapshotBack) {
      editDataDispatch({
        type: EditerDataActionEnum.SET_CURRENT_INDEX,
        payload: currentSnapshotIndex - 1,
      })
      devLogger('handleSnapshotBack')
    }
  }

  const handleSnapshotForward = () => {
    if (canSnapshotForward) {
      editDataDispatch({
        type: EditerDataActionEnum.SET_CURRENT_INDEX,
        payload: currentSnapshotIndex + 1,
      })
      devLogger('handleSnapshotForward')
    }
  }

  const handlePreviewClick = () => {
    devLogger('href', href)
    window.open(href, '_blank')
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
        <Button>保存</Button>
        <Button>清空</Button>
        <Button type="outline">出码</Button>
        <Button type="primary">发布</Button>
      </Space>
    </section>
  )
}

export default ToolBar
