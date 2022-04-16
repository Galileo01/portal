import React from 'react'

import { Form, Tabs } from '@arco-design/web-react'

import {
  PxInputNumber,
  FontSelect,
  FontWeightSelect,
  TextDecorationSelect,
  TextAlignSelect,
} from '@/components/custom-form-inner/simple'
import CustomColorPicker from '@/components/custom-color-picker'

import ItemsRow from '../items-row'

const { Item: FormItem } = Form
const { TabPane } = Tabs

export type FontFormProps = {
  usedFontList?: string[]
  customPalette?: string[]
}

const FontForm: React.FC<FontFormProps> = (props) => {
  const { usedFontList, customPalette } = props

  return (
    <Tabs type="text">
      <TabPane title="字体基础" key="font_base">
        <FormItem label="字体" field="font_family">
          <FontSelect options={usedFontList} />
        </FormItem>
        <FormItem label="颜色" field="color">
          <CustomColorPicker presetColors={customPalette} allowClear />
        </FormItem>
        <ItemsRow
          left={
            <FormItem label="大小" field="font_size">
              <PxInputNumber max={20} min={10} />
            </FormItem>
          }
          right={
            <FormItem label="字重" field="font_weight">
              <FontWeightSelect />
            </FormItem>
          }
        />
        <ItemsRow
          left={
            <FormItem label="修饰" field="text_decoration">
              <TextDecorationSelect />
            </FormItem>
          }
          right={
            <FormItem label="对齐" field="text_align">
              <TextAlignSelect />
            </FormItem>
          }
        />
      </TabPane>
      <TabPane title="字体阴影" key="text_shadow">
        <FormItem
          label="X-Y偏移"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <ItemsRow
            gutter={4}
            left={
              <FormItem field="text_shadow.x_offset">
                <PxInputNumber placeholder="X偏移" />
              </FormItem>
            }
            right={
              <FormItem field="text_shadow.y_offset">
                <PxInputNumber placeholder="Y偏移" />
              </FormItem>
            }
          />
        </FormItem>
        <FormItem
          label="阴影颜色"
          field="text_shadow.color"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <CustomColorPicker presetColors={customPalette} allowClear />
        </FormItem>
        <FormItem
          label="模糊半径"
          field="text_shadow.blur_radius"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <PxInputNumber />
        </FormItem>
      </TabPane>
    </Tabs>
  )
}

export default FontForm
