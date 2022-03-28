import * as React from 'react'

import { Button, Space, Popover } from '@arco-design/web-react'
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
import { devLogger } from '@/common/utils'

import styles from './index.module.less'

// TODO: 预览器 尺寸改变 ?
const ToolNav = () => {
  const [params] = useSearchParams()
  const href = useHref(
    `${ROUTE_PAGE}?page_id=${params.get('page_id')}&is_preview=1`
  )

  const { snapshotList, currentSnapshotIndex } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()

  const canSnapshotBack = currentSnapshotIndex > 0
  const canSnapshotForward =
    currentSnapshotIndex > -1 && currentSnapshotIndex < snapshotList.length - 1

  const handleSnapshotBack = () => {
    if (canSnapshotBack) {
      editerDataDispatch({
        type: EditerDataActionEnum.BACK,
      })
      devLogger('tool-bar', 'handleSnapshotBack')
    }
  }

  const handleSnapshotForward = () => {
    if (canSnapshotForward) {
      editerDataDispatch({
        type: EditerDataActionEnum.FORWARD,
      })
      devLogger('tool-bar', 'handleSnapshotForward')
    }
  }

  const handlePreviewClick = () => {
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
        <Button>保存</Button>
        <Button>清空</Button>
        <Button type="outline">出码</Button>
        <Button type="primary">发布</Button>
      </Space>
    </section>
  )
}

export default ToolNav
