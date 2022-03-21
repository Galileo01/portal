export type Component = {
  component: string // 组件名称 ：Swiper 唯一
  // name: string // 中文
  id: string
}

export type ComponentList = Component[]

export type EditerData = {
  // 快照列表 最大程度为 5
  snapshotList: ComponentList[]
  // 当前快照 所在的位置
  currentSnapshotIndex: number
  // 当前组件信息
  componenList: ComponentList
}
