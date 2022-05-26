import * as React from 'react'

import { ResourceType } from '@/typings/database'
import { GetResourceListRes } from '@/typings/request'
import { devLogger } from '@/common/utils'
import { getResourceList } from '@/network/resource'

export type hookParams = {
  resourceType?: ResourceType
  size: number
}

export const useFetchResrouceList = (params: hookParams) => {
  const { resourceType = 'page', size } = params

  const currentRef = React.useRef(1)
  const [loading, setLoading] = React.useState(false)
  const [resourceListRes, setResourceList] = React.useState<GetResourceListRes>(
    {
      resourceList: [],
      hasMore: 0,
    }
  )

  const fetchResourceList = React.useCallback(
    (type: 'init' | 'more', values?: Record<string, string | number>) => {
      devLogger('fetchResourceList', currentRef.current, size, values)
      const offset = (currentRef.current - 1) * size

      setLoading(true)
      getResourceList({
        resourceType,
        offset,
        limit: size,
        ...values,
      })
        .then((res) => {
          if (res.success) {
            const { hasMore, resourceList } = res.data
            setResourceList((pre) => ({
              hasMore,
              resourceList:
                type === 'init'
                  ? resourceList
                  : pre.resourceList.concat(resourceList),
            }))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [resourceType, size]
  )

  const hanldeLoadMore = React.useCallback(
    (values?: Record<string, string | number>) => {
      if (!resourceListRes.hasMore || loading) return

      currentRef.current += 1
      fetchResourceList('more', values)
    },
    [resourceListRes, fetchResourceList, loading]
  )

  const handleRefresh = React.useCallback(
    (values?: Record<string, string | number>) => {
      currentRef.current = 1
      fetchResourceList('init', values)
    },
    [fetchResourceList]
  )

  return {
    loading,
    resourceListRes,
    fetchResourceList,
    hanldeLoadMore,
    handleRefresh,
  }
}

export default useFetchResrouceList
