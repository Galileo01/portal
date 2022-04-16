import {
  LOSTORAGE_KEY_PAGE_CONFIGS,
  LOSTORAGE_KEY_IS_SIDER_COLLAPSE,
} from '@/common/constant'
import { PageConfig } from './editer'

export type Storage = {
  [LOSTORAGE_KEY_PAGE_CONFIGS]: string
  [LOSTORAGE_KEY_IS_SIDER_COLLAPSE]: string
}

export type StorageKeys = keyof Storage

export type GetLocalStorageFun = (
  key: StorageKeys,
  defaultValue?: string
) => string | undefined

export type SetLocalStorageFun = (key: StorageKeys, value: string) => void

export type PageConfigStorageValue = {
  [page_id: string]: PageConfig
}
