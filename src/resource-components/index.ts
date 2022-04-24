import {
  ResourceComponent,
  ComponentCategoryEnum,
  COMPONENT_CATEGORY_LABEL_MAP,
} from '@/typings/common/resosurce-component'

import navComponentConfig from './nav/config'
import navAsideComponentConfig from './nav_aside/config'
import exampleComponentCnfig from './color_example/config'

// 所有组件列表
export const RCList: Array<ResourceComponent> = [
  navComponentConfig,
  navAsideComponentConfig,
  exampleComponentCnfig,
]

export type CategoryItem = {
  cate: ComponentCategoryEnum
  label: string
  componentList: Array<ResourceComponent>
}

// 分类聚合
export const componentCategoryList: Array<CategoryItem> = [
  // 导航类组件
  {
    cate: ComponentCategoryEnum.NAVIGATION,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.NAVIGATION],
    componentList: RCList.filter(
      (component) => component.category === ComponentCategoryEnum.NAVIGATION
    ),
  },
  // banner
  {
    cate: ComponentCategoryEnum.BANNER,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.BANNER],
    componentList: RCList.filter(
      (component) => component.category === ComponentCategoryEnum.BANNER
    ),
  },
  // 其他
  {
    cate: ComponentCategoryEnum.OTHER,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.OTHER],
    componentList: RCList.filter(
      (component) => component.category === ComponentCategoryEnum.OTHER
    ),
  },
]
