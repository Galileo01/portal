import React, { Suspense } from 'react'

import type { RouteObject } from 'react-router-dom'

import Index from './pages/index'

import RouterFallback from './components/router-fallback'

// React.lazy 配合 import() 实现懒加载
const Page = React.lazy(() => import('./pages/page'))
const Editer = React.lazy(() => import('./pages/editer'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/page',
    element: (
      <Suspense fallback={<RouterFallback />}>
        <Page />
      </Suspense>
    ),
  },
  {
    path: '/editer',
    element: (
      <Suspense fallback={<RouterFallback />}>
        <Editer />
      </Suspense>
    ),
  },
]

export default routes
