/* eslint-disable react/destructuring-assignment */
// @ts-nocheck

import * as React from 'react'

import { devLogger } from '@/common/utils'
import Error from '@/components/error'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    // TODO:日志上报给服务器
    // logErrorToMyService(error, errorInfo)
    devLogger(
      'ErrorBoundary err',
      'error',
      error,
      'errorInfo',
      errorInfo,
      // eslint-disable-next-line no-restricted-globals
      location.href
    )

    this.setState({
      hasError: true,
    })
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <Error />
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children
  }
}

export default ErrorBoundary
