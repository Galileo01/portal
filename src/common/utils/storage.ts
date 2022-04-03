import { GetLocalStorageFun, SetLocalStorageFun } from '@/typings/storage'

export const getLocalStorage: GetLocalStorageFun = (key, defaultValue) =>
  localStorage.getItem(key) || defaultValue

export const setLocalStorage: SetLocalStorageFun = (key, value) =>
  localStorage.setItem(key, value)
