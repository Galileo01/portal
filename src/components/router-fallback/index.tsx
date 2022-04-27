import * as React from 'react'

import { Spin } from '@arco-design/web-react'

import Logo from '@/components/logo'
import style from './index.module.less'

const RouterFallback = () => (
  <Spin loading className={style.fallback}>
    <div className={style.content}>
      <Logo className={style.logo_wrapper} showText={false} />
    </div>
  </Spin>
)

export default RouterFallback
