import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import { PAGE_CONTAINER_CLASS } from '@/common/constant'
import { usePageInit } from '@/common/hooks/page-init'
import RCListRenderer from '@/components/rclist-renderer'

const Page = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo(
    () => ({
      page_id: params.get('page_id'),
      is_preview: Boolean(params.get('is_preview')),
    }),
    [params]
  )

  const { componentDataList, pageTitle } = usePageInit({
    pageId: searchParams.page_id,
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
      const handleStorage = () => {
        // eslint-disable-next-line no-restricted-globals
        location.reload()
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
