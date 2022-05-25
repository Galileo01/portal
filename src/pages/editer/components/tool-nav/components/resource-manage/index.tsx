import * as React from 'react'

import {
  Dropdown,
  Menu,
  Button,
  Empty,
  MenuProps,
} from '@arco-design/web-react'
import {
  IconUnorderedList,
  IconLaunch,
  IconDelete,
} from '@arco-design/web-react/icon'

import {
  getAllResourceConfig,
  clearResourceConfig,
} from '@/common/utils/storage'
import { generateEditerPath } from '@/common/utils/route'
import { EditType } from '@/typings/common/editer'
import { CUSTOM_STORAGE_EVENT } from '@/common/constant'

import styles from './index.module.less'

const { Item: MenuItem } = Menu

export type ResourceManageProps = {
  currentResourceId: string
}
export type ResourceItem = { resourceId: string; editType: string }

const ResourceManage: React.FC<ResourceManageProps> = (props) => {
  const { currentResourceId } = props

  const [resourceList, setResourceList] = React.useState<Array<ResourceItem>>(
    []
  )

  const getLocalResourceList = React.useCallback(() => {
    const allResourceConfig = getAllResourceConfig() || {}
    const list = Object.keys(allResourceConfig).map((key) => ({
      resourceId: key,
      editType: allResourceConfig[key].edit_type,
    }))
    setResourceList(list)
  }, [])

  const handleItemClick = React.useCallback<
    NonNullable<MenuProps['onClickMenuItem']>
  >((resourceId, event) => {
    const { btnType, editType = EditType.CREATE } = (
      event.target as HTMLElement
    ).dataset
    if (!btnType) return
    if (btnType === 'open') {
      // 等待 官方 修复 bug https://github.com/remix-run/react-router/issues/8245 ,使用 navigator 跳转 页面不刷新问题

      const href = generateEditerPath({
        resource_id: resourceId,
        edit_type: editType,
        use_local: editType === 'edit', // edit_type === edit 的页面 需要 追加 use_local 使用本地存储
      })

      window.open(href, '_self')
    } else if (btnType === 'delete') {
      clearResourceConfig(resourceId)
      // 重新渲染
      setResourceList((preList) => {
        const index = preList.findIndex(
          (resource) => resource.resourceId === resourceId
        )
        preList.splice(index, 1)
        return [...preList]
      })
    }
  }, [])

  const droplist = React.useMemo(
    () => (
      <Menu onClickMenuItem={handleItemClick}>
        {resourceList.length > 0 ? (
          <>
            {resourceList.map(({ resourceId, editType }) => {
              const isCurrent = resourceId === currentResourceId

              return (
                <MenuItem key={resourceId} data-resource-id={resourceId}>
                  <div className={styles.inner_wrapper}>
                    <span>{resourceId}</span>
                    {isCurrent ? (
                      <span className={styles.current}>当前页面</span>
                    ) : (
                      <div className={styles.btns}>
                        <Button
                          icon={<IconLaunch />}
                          shape="circle"
                          size="mini"
                          data-btn-type="open"
                          data-edit-type={editType}
                        />
                        <Button
                          icon={<IconDelete />}
                          shape="circle"
                          size="mini"
                          status="danger"
                          data-btn-type="delete"
                          data-edit-type={editType}
                        />
                      </div>
                    )}
                  </div>
                </MenuItem>
              )
            })}
          </>
        ) : (
          <Empty className={styles.empty} />
        )}
      </Menu>
    ),
    [resourceList, handleItemClick, currentResourceId]
  )

  React.useEffect(() => {
    getLocalResourceList()
  }, [getLocalResourceList])

  // storage 事件 触发时 重新获取
  React.useEffect(() => {
    window.addEventListener(CUSTOM_STORAGE_EVENT, getLocalResourceList)
    // 清理 监听
    return () => {
      window.removeEventListener(CUSTOM_STORAGE_EVENT, getLocalResourceList)
    }
  }, [getLocalResourceList])

  return (
    <div className={styles.resource_manage}>
      <Dropdown droplist={droplist} position="bottom" trigger="click">
        <div className="cursor_pointer">
          <IconUnorderedList />
          <span className={styles.text}>本地资源管理</span>
        </div>
      </Dropdown>
    </div>
  )
}

export default ResourceManage
