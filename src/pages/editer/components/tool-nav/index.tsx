import * as React from 'react'

import {
  Button,
  Space,
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

  usePrompt('???????????????????????????????????????????????????', isBlocking)

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
    Message.success('????????????')
  }

  const handleClearConfirm = () => {
    editerDataDispatch({
      type: EditerDataActionEnum.CLEAR,
    })
    clearResourceConfig(resourceId)
    restorePreviewColorVariable()
    removeFontStyleNode()
    setIsBlocking(false)
    Message.success('????????????')
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
    const { thumbnail, resourceType, ...restData } = values
    // values ?????? resourceType??? ????????????????????? ??????????????? -> ????????? ??????????????? ??????
    const isPublish =
      searchParamsRef.current.edit_type === 'create' ||
      resourceType !== searchParamsRef.current.resource_type

    setOperating(true)
    // ??????????????? ???????????? ????????? cos
    const thumbnailUrl = await uploadCos(
      thumbnail,
      `${restData.resourceId}.png`
    )

    const oprateRes = await operateResource({
      operateType: isPublish ? 'publish' : 'update',
      resourceData: {
        ...restData,
        resourceType,
        thumbnailUrl,
        config: stringfyConfig(restData.title, true),
      },
    })

    if (oprateRes.success) {
      hidePublishModal()
      clearResourceConfig(resourceId)
      setIsBlocking(false)

      // ?????????????????????
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
          Message.success('????????????')
        })
      }

      fetchDataDispatch({
        type: FetchDataActionEnum.SET_RESOURCE,
        payload: oprateRes.data,
      })

      Modal.success({
        title: '??????',
        footer: null,
        content: (
          <div>
            <div>
              {`${isPublish ? '??????' : '??????'}?????? , `}
              <a href={pageUrl} target="_blank" rel="noreferrer">
                ????????????
              </a>
              <Tooltip content="????????????">
                <IconCopy className="question_icon" onClick={handleCopyClick} />
              </Tooltip>
            </div>
            {isPublish && (
              <div className="tip_text" style={{ marginTop: 10 }}>
                ??????????????????????????????url
              </div>
            )}
          </div>
        ),
        cancelText: '??????',
        onCancel: () => {
          // NOTE: ?????????????????? ??????????????? ??????????????? ?????????????????????
          if (isPublish) {
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
      Message.warning('???????????????????????????????????????')
      return
    }
    // ???????????? ???????????? ????????? ??????
    if (searchParamsRef.current.resource_type === 'page') {
      showOutputModal()
    } else {
      Message.warning('???????????????????????????')
    }
  }

  const handlePublishBtnClick = () => {
    if (!userInfo) {
      Message.warning('???????????????????????????????????????')
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
          Message.success('????????????,????????????')
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
        <Tooltip content={`??????: ????????????${MAX_LENGTH}???????????????`}>
          <Tag color="blue">{`${currentSnapshotIndex + 1}/${
            snapshotList.length
          }`}</Tag>
        </Tooltip>
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
          <Tooltip content="???:???????????????????????????????????????">
            <Button type="primary">??????</Button>
          </Tooltip>
        </Link>
        <Button onClick={handleSaveClick}>??????</Button>
        <Popconfirm
          onOk={handleClearConfirm}
          title="????????????????????????????????????????"
        >
          <Button>??????</Button>
        </Popconfirm>
        <Button type="outline" onClick={handleOutputBtnClick}>
          ??????
        </Button>
        <Button type="primary" onClick={handlePublishBtnClick}>
          ??????
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
