import * as React from 'react'

import { useSearchParams } from 'react-router-dom'

import styles from './index.module.less'

const Page = () => {
  const [params] = useSearchParams()
  const pageIdRef = React.useRef(params.get('page_id'))
  const isPreviewRef = React.useRef(Boolean(params.get('is_preview')))

  return (
    <div className={styles.about}>
      Page
      <div>page_id:{pageIdRef.current}</div>
      <div>is_pewview:{`${isPreviewRef.current}`}</div>
    </div>
  )
}

export default Page
