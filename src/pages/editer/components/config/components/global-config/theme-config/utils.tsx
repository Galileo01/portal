import * as React from 'react'

import { Form } from '@arco-design/web-react'

import CustomColorPicker from '@/components/custom-color-picker'

import {
  COLOR_VARIABLES,
  KEY_OF_COLOR_VARIABLES,
} from '@/common/constant/color-variable'

const { Item: FormItem } = Form

export const generateColorFormItems = (customPalette?: string[]) =>
  KEY_OF_COLOR_VARIABLES.map((key) => {
    const { label } = COLOR_VARIABLES[key]
    return (
      <FormItem label={label} field={key} key={key}>
        <CustomColorPicker
          presetColors={customPalette}
          allowClear
          clearToValid
        />
      </FormItem>
    )
  })

export default generateColorFormItems
