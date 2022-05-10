import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

export type EditerSearchParams = {
  resource_id: string
  edit_type: string
  use_local: boolean
  title: string
}

export const useEditerParams = () => {
  const [params] = useSearchParams()

  const searchParams = React.useMemo(
    () => ({
      resource_id: params.get('resource_id') || '',
      edit_type: params.get('edit_type') || 'create',
      use_local: Boolean(params.get('use_local')),
      title: params.get('title') || '',
    }),
    [params]
  )

  return {
    searchParams,
  }
}

export default useEditerParams
