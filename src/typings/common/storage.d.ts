import {
  LOSTORAGE_KEY_PAGE_CONFIGS,
  LOSTORAGE_KEY_IS_SIDER_COLLAPSE,
  LOSTORAGE_KEY_TOKEN,
} from '@/common/constant'

import { PageConfig } from './editer'

export type PageConfigInStorage = PageConfig & {
  edit_type: string
}

export type Storage = {
  [LOSTORAGE_KEY_PAGE_CONFIGS]: string
  [LOSTORAGE_KEY_IS_SIDER_COLLAPSE]: string
  [LOSTORAGE_KEY_TOKEN]: string
}

export type StorageKeys = keyof Storage

export type GetLocalStorageFun = (
  key: StorageKeys,
  defaultValue?: string
) => string | undefined

export type SetLocalStorageFun = (key: StorageKeys, value: string) => void

export type PageConfigStorageValue = {
  [resource_id: string]: PageConfigInStorage
}
