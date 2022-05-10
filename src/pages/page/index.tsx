import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import {
  PAGE_CONTAINER_CLASS,
  LOSTORAGE_KEY_IS_SIDER_COLLAPSE,
} from '@/common/constant'
import { usePageInit } from '@/common/hooks/page-init'
import RCListRenderer from '@/components/rclist-renderer'

const Page = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo(
    () => ({
      resource_id: params.get('resource_id'),
      is_preview: Boolean(params.get('is_preview')),
    }),
    [params]
  )

  const { componentDataList, pageTitle } = usePageInit({
    resourceId: searchParams.resource_id,
    isEditer: false,
    initType: searchParams.is_preview ? 'restore' : 'fetch',
  })

  React.useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle
    }
  }, [pageTitle])

  // localStorage 更新时 刷新页面
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (searchParams.is_preview) {
      const handleStorage = (e: unknown) => {
        const { key } = e as { key: string }
        if (key !== LOSTORAGE_KEY_IS_SIDER_COLLAPSE) {
          // eslint-disable-next-line no-restricted-globals
          location.reload()
        }
      }
      window.addEventListener('storage', handleStorage)

      return () => {
        window.addEventListener('storage', handleStorage)
      }
    }
  }, [searchParams])

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <RCListRenderer componentDataList={componentDataList} />
    </div>
  )
}

export default Page
