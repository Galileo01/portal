import * as React from 'react'

import { Collapse } from '@arco-design/web-react'

import { useFetchDataStore } from '@/store/fetch-data'

import FontFormField from '../font-form'

const { Item: CollapseItem } = Collapse

const FontConfig = () => {
  const { allFontList } = useFetchDataStore()

  return (
    <CollapseItem header="字体配置" name="global_config.font-config">
      <FontFormField fontList={allFontList} />
    </CollapseItem>
  )
}

export default FontConfig
