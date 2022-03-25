import {
  ResourceComponent,
  ComponentCategoryEnum,
} from '@/typings/resosurce-component'

import navComponentConfig from './nav/config'
import navTestComponentConfig from './nav_test/config'
/**
 * TODO:
 *  1.previewImg  转为 服务器存储 url
 */
// 所有组件列表
export const componentsList: ResourceComponent[] = [
  navComponentConfig,
  navTestComponentConfig,
]

// 导航类组件
export const navCateComponents = componentsList.filter(
  (component) => component.category === ComponentCategoryEnum.NAVIGATION
)
