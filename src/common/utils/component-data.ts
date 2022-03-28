import { ComponentDataList } from '@/typings/editer'

import { getIdFromElement } from './element'

export const getComponentDataIndexFromElement: (
  componenDataList: ComponentDataList,
  element: HTMLElement
) => number = (componenDataList, element) => {
  const id = getIdFromElement(element)

  const index = id
    ? componenDataList.findIndex((component) => component.id === id)
    : -1
  return index
}

export default getComponentDataIndexFromElement
