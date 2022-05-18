import { CodeOutputData, CodeOutputRes } from '@/typings/request'

import instance from './index'

const baseRoute = '/code'

export const outputCode = (data: CodeOutputData) =>
  instance.post<CodeOutputRes>(`${baseRoute}/output`, data)

export default outputCode
