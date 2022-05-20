import * as React from 'react'

import { Cascader, CascaderProps } from '@arco-design/web-react'
import { FontList } from '@/typings/database'

import { computeCascaderOptions } from './utils'

export type FontCascaderProps = CascaderProps & {
  fontList: FontList
}

const FontCascader: React.FC<FontCascaderProps> = ({ fontList, ...rest }) => {
  const options = React.useMemo(
    () => computeCascaderOptions(fontList),
    [fontList]
  )

  return (
    <Cascader
      options={options}
      allowClear
      renderFormat={(valueShow) => valueShow[1]}
      {...rest}
    />
  )
}

export default FontCascader
