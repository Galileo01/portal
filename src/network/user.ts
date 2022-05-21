import { UserBase, UserLoginData, UserLoginRes } from '@/typings/request'
import { User } from '@/typings/database'

import instance from './index'

const baseRoute = '/user'

// 携带token 发送请求 ，获取用户信息
export const getUserInfo = () => instance.get<UserBase>(`${baseRoute}/getInfo`)

export const login = (data: UserLoginData) =>
  instance.post<UserLoginRes>(`${baseRoute}/login`, data)

export const updateUserInfo = (data: Partial<User>) =>
  instance.post<UserBase>(`${baseRoute}/updateInfo`, data)
