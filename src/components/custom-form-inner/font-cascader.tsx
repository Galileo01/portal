import * as React from 'react'

import { Cascader, CascaderProps } from '@arco-design/web-react'
import { FontList } from '@/@types/portal-network'

import { computeCascaderOptions } from '@/common/utils/font'

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