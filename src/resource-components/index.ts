import { ResourceComponent } from '@/typings/resosurce-component'

import Nav from './nav'

/**
 * TODO:
 *  1.previewImg  转为 服务器存储 url
 */
const componentsList: ResourceComponent[] = [
  {
    name: '导航',
    key: 'nav',
    previewImg:
      'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*luthRonCYuQAAAAAAAAAAABkARQnAQ',
    category: 'navigation',
    component: Nav,
  },
]

export default componentsList
