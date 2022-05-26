import * as React from 'react'

import {
  Button,
  Space,
  Popover,
  Message,
  Popconfirm,
  Tag,
  Modal,
  Tooltip,
} from '@arco-design/web-react'
import { IconRedo, IconUndo, IconCopy } from '@arco-design/web-react/icon'
import { Link, useSearchParams } from 'react-router-dom'

import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'
import UserComponent from '@/components/user'
import {
  useEditerDataStore,
  useEditerDataDispatch,
  EditerDataActionEnum,
  MAX_LENGTH,
} from '@/store/editer-data'
import { useUserInfo } from '@/store/user-info'
import { useFetchDataDispatch, FetchDataActionEnum } from '@/store/fetch-data'
import { ROUTE_PAGE } from '@/common/constant/route'
import { setPageConfigById, clearResourceConfig } from '@/common/utils/storage'
import { restorePreviewColorVariable } from '@/common/utils/color-variable'
import { removeFontStyleNode } from '@/common/utils/font'
import { usePrompt } from '@/common/hooks/react-router-dom'
import { generateEditerPath, generatePagePath } from '@/common/utils/route'
import { operateResource } from '@/network/resource'
import { outputCode } from '@/network/code'
import { uploadCos } from '@/network/cos'
import { EditType } from '@/typings/common/editer'
import { transformToNecessaryList } from '@/common/utils/prop-config'

import styles from './index.module.less'
import ResourceManage from './components/resource-manage'
import PublishModal, { PublishModalProps } from './components/publish-modal'
import OutputModal, { OutputModalProps } from './components/output-modal'
import { startDownloadZip } from './utils'

export type ToolNavProps = {
  resourceId: string
  editType: string
}

const ToolNav: React.FC<ToolNavProps> = ({ resourceId, editType }) => {
  const [isBlocking, setIsBlocking] = React.useState(true)
  const [publishModalVisible, setPublishModalVisible] = React.useState(false)
  const [outputModalVisible, setOutputModalVisible] = React.useState(false)
  const [outputing, setOutputing] = React.useState(false)
  const [operating, setOperating] = React.useState(false)

  usePrompt('您还未保存配置，确认离开编辑页么？', isBlocking)

  const {
    snapshotList,
    currentSnapshotIndex,
    componentDataList,
    globalConfig,
    styleConfig,
  } = useEditerDataStore()
  const editerDataDispatch = useEditerDataDispatch()
  const userInfo = useUserInfo()
  const fetchDataDispatch = useFetchDataDispatch()

  const [params] = useSearchParams()

  const searchParamsRef = React.useRef({
    resource_type: params.get('resource_type') || 'page',
    edit_type: params.get('edit_type') || EditType.CREATE,
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
    setPublishModalVisible(true)
  }

  const hidePublishModal = () => {
    setPublishModalVisible(false)
  }

  const showOutputModal = () => {
    setOutputModalVisible(true)
  }

  const hideOutputModal = () => {
    setOutputModalVisible(false)
  }

  const stringfyConfig = (title: string, transform = false) =>
    JSON.stringify({
      title,
      globalConfig,
      styleConfig,
      componentDataList: transform
        ? transformToNecessaryList(componentDataList)
        : componentDataList,
    })

  const handleResourceOperate: PublishModalProps['onConfirm'] = async (
    values
  ) => {
    const isPublish = searchParamsRef.current.edit_type === 'create'
    const { thumbnail, ...restData } = values
    setOperating(true)
    // 点击确认时 才上传至 腾讯云 cos
    const thumbnailUrl = await uploadCos(
      thumbnail,
      `${restData.resourceId}.png`
    )

    const oprateRes = await operateResource({
      operateType: isPublish ? 'publish' : 'update',
      resourceData: {
        ...restData,
        thumbnailUrl,
        config: stringfyConfig(restData.title, true),
      },
    })

    if (oprateRes.success) {
      hidePublishModal()
      clearResourceConfig(resourceId)
      setIsBlocking(false)

      // 并清空本地数据
      if (isPublish) {
        clearResourceConfig(resourceId)
      }

      const pageUrl = generatePagePath(
        {
          resource_id: resourceId,
          resource_type: searchParamsRef.current.resource_type,
        },
        true
      )

      const handleCopyClick = () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
          Message.success('复制成功')
        })
      }

      fetchDataDispatch({
        type: FetchDataActionEnum.SET_RESOURCE,
        payload: oprateRes.data,
      })

      Modal.success({
        title: '提示',
        footer: null,
        content: (
          <div>
            <div>
              {`${isPublish ? '发布' : '更新'}成功 , `}
              <a href={pageUrl} target="_blank" rel="noreferrer">
                点此访问
              </a>
              <Tooltip content="复制链接">
                <IconCopy className="question_icon" onClick={handleCopyClick} />
              </Tooltip>
            </div>
            {isPublish && (
              <div className="tip_text" style={{ marginTop: 10 }}>
                弹窗关闭后会强制更新url
              </div>
            )}
          </div>
        ),
        cancelText: '取消',
        onCancel: () => {
          // NOTE: 若是发布模式 发布成功后 必须跳转到 编辑模式的页面
          if (isPublish) {
            const { resourceType } = values
            const newHref = generateEditerPath({
              resource_id: resourceId,
              edit_type: 'edit',
              resource_type: resourceType,
            })
            // eslint-disable-next-line no-restricted-globals
            location.replace(newHref)
          }
        },
      })
    }
    setOperating(false)
  }

  const handleOutputBtnClick = () => {
    if (!userInfo) {
      Message.warning('您还未登录，请登录后再尝试')
      return
    }
    // 资源类型 为页面时 才允许 出码
    if (searchParamsRef.current.resource_type === 'page') {
      showOutputModal()
    } else {
      Message.warning('模板资源不支持出码')
    }
  }

  const handlePublishBtnClick = () => {
    if (!userInfo) {
      Message.warning('您还未登录，请登录后再尝试')
      return
    }
    showPublishModal()
  }

  const handlePageOutput: OutputModalProps['onConfirm'] = (values) => {
    const { useLocal, ...restField } = values
    setOutputing(true)
    setIsBlocking(false)
    outputCode({
      ...restField,
      pageConfig: useLocal ? stringfyConfig(restField.title) : undefined,
    })
      .then((res) => {
        if (res.success === 1) {
          hideOutputModal()
          Message.success('出码成功,开始下载')
          startDownloadZip(res.data.zipName)
        }
      })
      .finally(() => {
        setOutputing(false)
        setIsBlocking(true)
      })
  }

  return (
    <section className={styles.tool_bar}>
      <Space size="large">
        <Logo size={50} circle />
        <ResourceManage currentResourceId={resourceId} />
      </Space>
      <Space className={styles.btns} size="medium">
        <ThemeSwitch />
        <Button
          size="mini"
          icon={<IconUndo />}
          className={styles.snapshot_btn}
          disabled={!canSnapshotBack}
          onClick={handleSnapshotBack}
        />
        <Popover content={`注意: 最多保存${MAX_LENGTH}个状态快照`}>
          <Tag color="blue">{snapshotList.length}</Tag>
        </Popover>
        <Button
          size="mini"
          icon={<IconRedo />}
          className={styles.snapshot_btn}
          disabled={!canSnapshotForward}
          onClick={handleSnapshotForward}
        />
        <Link
          to={{
            pathname: ROUTE_PAGE,
            search: `resource_id=${resourceId}&resource_type=${searchParamsRef.current.resource_type}&is_preview=1`,
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
        <Button type="outline" onClick={handleOutputBtnClick}>
          出码
        </Button>
        <Button type="primary" onClick={handlePublishBtnClick}>
          发布
        </Button>
        <UserComponent />
      </Space>
      <PublishModal
        resourceId={resourceId}
        resourceType={searchParamsRef.current.resource_type}
        visible={publishModalVisible}
        fetching={operating}
        onCancel={hidePublishModal}
        onConfirm={handleResourceOperate}
      />
      <OutputModal
        pageId={resourceId}
        editType={searchParamsRef.current.edit_type}
        visible={outputModalVisible}
        fetching={outputing}
        onCancel={hideOutputModal}
        onConfirm={handlePageOutput}
      />
    </section>
  )
}

export default ToolNav
