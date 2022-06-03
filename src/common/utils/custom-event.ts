import {
  TEMPLATE_IMPORT_EVENT,
  CUSTOM_STORAGE_EVENT,
  LOSTORAGE_KEY_PAGE_CONFIGS,
} from '@/common/constant'

export const dispatchTemplateImportEvent = (resourceId: string) => {
  const customEvent = new CustomEvent(TEMPLATE_IMPORT_EVENT, {
    detail: {
      resourceId,
    },
  })
  window.dispatchEvent(customEvent)
}

// 同一页面下更新 localStorage  不会触发 storage 事件，故需要触发自定义事件
export const dispatchCustomStorageEvent = () => {
  const customEvent = new CustomEvent(CUSTOM_STORAGE_EVENT, {
    detail: {
      key: LOSTORAGE_KEY_PAGE_CONFIGS,
    },
  })
  window.dispatchEvent(customEvent)
}
