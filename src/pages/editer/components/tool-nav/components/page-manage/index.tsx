import * as React from 'react'

import { Dropdown, Menu, Button, MenuProps } from '@arco-design/web-react'
import {
  IconUnorderedList,
  IconLaunch,
  IconDelete,
} from '@arco-design/web-react/icon'

import { getAllPageConfig, clearPageConfig } from '@/common/utils/storage'
import { generateEditerPath } from '@/common/utils/route'

import styles from './index.module.less'

const { Item: MenuItem } = Menu

export type PageManageProps = {
  currentPageId: string
}
export type PageItem = { pageId: string; editType: string }

const PageManage: React.FC<PageManageProps> = (props) => {
  const { currentPageId } = props

  const [pageList, setPageList] = React.useState<Array<PageItem>>([])

  const getLocalPageList = React.useCallback(() => {
    const allPageConfig = getAllPageConfig() || {}
    const list = Object.keys(allPageConfig).map((key) => ({
      pageId: key,
      editType: allPageConfig[key].edit_type,
    }))
    setPageList(list)
  }, [])

  const handleItemClick = React.useCallback<
    NonNullable<MenuProps['onClickMenuItem']>
  >((pageId, event) => {
    const { btnType, editType = 'create' } = (event.target as HTMLElement)
      .dataset
    if (!btnType) return
    if (btnType === 'open') {
      // FIXME: 等待 官方 修复 bug https://github.com/remix-run/react-router/issues/8245 ,使用 navigator 跳转

      const href = generateEditerPath({
        page_id: pageId,
        edit_type: editType,
        use_local: editType === 'edit', // edit_type === edit 的页面 需要 追加 use_local 使用本地存储
      })

      window.open(href, '_self')
    } else if (btnType === 'delete') {
      clearPageConfig(pageId)
      // 重新渲染
      setPageList((preList) => {
        const index = preList.findIndex((page) => page.pageId === pageId)
        preList.splice(index, 1)
        return [...preList]
      })
    }
  }, [])

  const droplist = React.useMemo(
    () => (
      <Menu onClickMenuItem={handleItemClick}>
        {pageList.map(({ pageId, editType }) => {
          const isCurrent = pageId === currentPageId

          return (
            <MenuItem key={pageId} data-page-id={pageId}>
              <div className={styles.inner_wrapper}>
                <span>{pageId}</span>
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
      </Menu>
    ),
    [pageList, handleItemClick, currentPageId]
  )

  React.useEffect(() => {
    getLocalPageList()
  }, [getLocalPageList])

  // storage 事件 触发时 重新获取
  React.useEffect(() => {
    window.addEventListener('storage', getLocalPageList)
    // 清理 监听
    return () => {
      window.removeEventListener('storage', getLocalPageList)
    }
  }, [getLocalPageList])

  return (
    <div className={styles.page_manage}>
      <Dropdown droplist={droplist} position="bottom" trigger="click">
        <div className="cursor_pointer">
          <IconUnorderedList />
          <span className={styles.text}>本地资源管理</span>
        </div>
      </Dropdown>
    </div>
  )
}

export default PageManage
