import {
  ComponentDataList,
  KeyComponentDataList,
} from '@/typings/common/editer'
import { RCList } from '@/resource-components'

// 发布/更新/出码 时  移除 ComponentDataItem 上 的非关键数据 减小 config 字符串长度
export const transformToNecessaryList: (
  componentDataList: ComponentDataList
) => KeyComponentDataList = (componentDataList) =>
  componentDataList.map(({ id, resourceComponent }) => ({
    id,
    resourceComponent: {
      key: resourceComponent.key,
      props: resourceComponent.props,
    },
  }))

// 通过请求 恢复 时，添加 ComponentDataItem 上 的非关键数据
export const transformToDataList: (
  keyComponentDataList: KeyComponentDataList
) => ComponentDataList = (keyComponentDataList: KeyComponentDataList) =>
  keyComponentDataList.map(({ id, resourceComponent }) => {
    const originRC = RCList.find((com) => com.key === resourceComponent.key)!
    return {
      id,
      resourceComponent: {
        ...originRC,
        props: resourceComponent.props,
      },
    }
  })
