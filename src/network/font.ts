import instance from './index'

import { FontList } from '@/typings/database'

export const getFontList = () => instance.get<FontList>('/font/getList')

export default getFontList
