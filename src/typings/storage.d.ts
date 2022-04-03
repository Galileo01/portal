import {
  LOSTORAGE_KEY_COMPONENT_CONFIG,
  LOSTORAGE_KEY_IS_SIDER_COLLAPSE,
} from '@/common/constant'

export type Storage = {
  [LOSTORAGE_KEY_COMPONENT_CONFIG]: string
  [LOSTORAGE_KEY_IS_SIDER_COLLAPSE]: string
}

export type StorageKeys = keyof Storage

export type GetLocalStorageFun = (
  key: StorageKeys,
  defaultValue?: string
) => string | undefined

export type SetLocalStorageFun = (key: StorageKeys, value: string) => void
