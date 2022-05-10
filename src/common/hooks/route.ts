import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import { ResourceType } from '@/typings/database'

export type EditerSearchParams = {
  resource_id: string
  edit_type: string
  use_local: boolean
  title: string
  resource_type: ResourceType
}

export const useEditerParams = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo<EditerSearchParams>(
    () => ({
      resource_id: params.get('resource_id') || '',
      edit_type: params.get('edit_type') || 'create',
      use_local: Boolean(params.get('use_local')),
      title: params.get('title') || '',
      resource_type:
        params.get('resource_type') === 'page' ? 'page' : 'template',
    }),
    [params]
  )

  return {
    searchParams,
  }
}

export default useEditerParams
