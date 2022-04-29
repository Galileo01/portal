import {
  ResourceComponent,
  ComponentCategoryEnum,
  COMPONENT_CATEGORY_LABEL_MAP,
} from '@/typings/common/resosurce-component'

import './common.less'

import navComponentConfig from './nav/config'
import navAsideComponentConfig from './nav-aside/config'
import KVImgComponentConfig from './kv-img/config'
import videoBannerComponentConfig from './video-banner/config'
import swiperComponentConfig from './swiper/config'
import contenTitleComponentConfig from './content-title/config'
import exampleComponentConfig from './color-example/config'
import backTopComponentConfig from './back-top/config'
import InfoHorizontalConfig from './info-horizontal/config'
import GridBoxConfig from './gird-box/config'

const navComponentList = [
  navComponentConfig,
  navAsideComponentConfig,
] as unknown as Array<ResourceComponent>

const bannerComponentList = [
  KVImgComponentConfig,
  videoBannerComponentConfig,
  swiperComponentConfig,
] as unknown as Array<ResourceComponent>

const contentComponentList = [
  contenTitleComponentConfig,
  InfoHorizontalConfig,
  GridBoxConfig,
] as unknown as Array<ResourceComponent>

const otherComponentList = [
  exampleComponentConfig,
  backTopComponentConfig,
] as unknown as Array<ResourceComponent>

// 所有组件列表
export const RCList = [
  ...navComponentList,
  ...bannerComponentList,
  ...contentComponentList,
  ...otherComponentList,
] as Array<ResourceComponent>

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
    componentList: navComponentList,
  },
  // banner
  {
    cate: ComponentCategoryEnum.BANNER,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.BANNER],
    componentList: bannerComponentList,
  },
  // content
  {
    cate: ComponentCategoryEnum.CONTENT,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.CONTENT],
    componentList: contentComponentList,
  },
  // 其他
  {
    cate: ComponentCategoryEnum.OTHER,
    label: COMPONENT_CATEGORY_LABEL_MAP[ComponentCategoryEnum.OTHER],
    componentList: otherComponentList,
  },
]
