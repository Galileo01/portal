// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios'

export type CustomResponse<T = unknown> = {
  success: 1 | 0
  data: T
}

// 配合 响应拦截器中 重写 响应数据的 类型  AxiosInstance
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any, R = CustomResponse<T>, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
    post<T = any, R = CustomResponse<T>, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>
    ): Promise<R>
  }
}
