/* eslint-disable no-restricted-globals */
import * as React from 'react'

import styles from './index.module.less'

const Error = () => {
  const [count, setCount] = React.useState(5)
  const countRef = React.useRef(5)

  React.useEffect(() => {
    countRef.current = count
  }, [count])

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (countRef.current === 0) {
        const { origin } = location
        location.assign(`${origin}/`)
        clearInterval(timer)
      } else {
        setCount(countRef.current - 1)
      }
    }, 1000)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.error_container}>
      <div className={styles.error}>Error</div>
      <div className={styles.error_text}>
        Oops
        <br />
        发生了一些错误:(
        <br />
        <div className={styles.tip}>会在{count}s后跳转到首页</div>
      </div>
    </div>
  )
}

export default Error
