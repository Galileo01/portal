import axios, { AxiosResponse, AxiosError } from 'axios'
import { Message } from '@arco-design/web-react'

import { IS_DEV, devLogger } from '@/common/utils'
import { getLocalStorage, setLocalStorage } from '@/common/utils/storage'

export const baseURL = IS_DEV
  ? 'http://localhost:5000'
  : 'http://81.68.119.113:5000'

const ins = axios.create({
  baseURL,
  timeout: 50000, // 50s超时，出码功能耗时比较长
})

ins.interceptors.request.use((config) => {
  const token = getLocalStorage('token')
  // 添加 token
  if (token) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
ins.interceptors.response.use(
  (res: AxiosResponse) => {
    const { success, data } = res.data
    // 提前输出
    if (!success) {
      devLogger('axios interceptors.response error', data)
      Message.error(data)
    }
    return res.data
  },
  (err: AxiosError) => {
    devLogger('axios interceptors.response error', err.message)
    Message.error(err.message)
    // 401 ： 用户token 验证失败 清除 token
    if (err.response?.status === 401) {
      setLocalStorage('token', '')
    }
    return {
      data: {
        data: err.message,
        success: 0,
      },
    }
  }
)

export default ins
