import {
  ResourceComponent,
  ComponentCategoryEnum,
} from '@/typings/resosurce-component'

import navComponentConfig from './nav/config'
import navTestComponentConfig from './nav_test/config'
import exampleComponentCnfig from './example/config'
/**
 * TODO:
 *  1.previewImg  转为 服务器存储 url
 */
// 所有组件列表
export const RCList: ResourceComponent[] = [
  navComponentConfig,
  navTestComponentConfig,
  exampleComponentCnfig,
]

// 导航类组件
export const navCateComponents = RCList.filter(
  (component) => component.category === ComponentCategoryEnum.NAVIGATION
)
