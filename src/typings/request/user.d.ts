import { User } from '@/typings/database'

export type UserBase = Omit<User, 'password'>

export type UserLoginData = {
  name: string
  password: string
}

export type UserLoginRes = {
  user: UserBase
  token: string
  isRegister: 1 | 0 // 标识 是 注册行为
}
