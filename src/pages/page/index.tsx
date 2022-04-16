import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import { PAGE_CONTAINER_CLASS } from '@/common/constant'
import { usePageInit } from '@/common/hooks/page-init'
import RCListRenderer from '@/components/rclist-renderer'

const Page = () => {
  const [params] = useSearchParams()

  const searchParamsRef = React.useRef({
    page_id: params.get('page_id'),
    is_preview: Boolean(params.get('is_preview')),
  })

  const { componentDataList } = usePageInit({
    pageId: searchParamsRef.current.page_id,
    isEditer: false,
    initType: searchParamsRef.current.is_preview ? 'restore' : 'fetch',
  })

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <RCListRenderer componentDataList={componentDataList} />
    </div>
  )
}

export default Page
