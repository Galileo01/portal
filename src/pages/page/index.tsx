import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import {
  PAGE_CONTAINER_CLASS,
  LOSTORAGE_KEY_PAGE_CONFIGS,
} from '@/common/constant'
import { useResourceInit } from '@/common/hooks/resource-init'
import RCListRenderer from '@/components/rclist-renderer'

const Page = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo(
    () => ({
      resource_id: params.get('resource_id'),
      is_preview: Boolean(params.get('is_preview')),
      resource_type: params.get('resource_type') || 'template',
    }),
    [params]
  )

  const { componentDataList, pageTitle } = useResourceInit({
    resourceId: searchParams.resource_id,
    isEditer: false,
    initType: searchParams.is_preview ? 'restore' : 'fetch',
    resourceType: searchParams.resource_type,
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
      const handleStorage: (e: StorageEvent) => void = (e) => {
        const { key } = e
        if (key === LOSTORAGE_KEY_PAGE_CONFIGS) {
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
