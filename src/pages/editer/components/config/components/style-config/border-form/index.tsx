import * as React from 'react'

import { Form, Tabs } from '@arco-design/web-react'

import {
  PxInputNumber,
  BorderStyleSelect,
} from '@/components/custom-form-inner/simple'
import CustomColorPicker from '@/components/custom-color-picker'

import ItemsRow from '../items-row'

const { Item: FormItem } = Form
const { TabPane } = Tabs

export type BorderFormProps = {
  customPalette?: string[]
}

/**
 * NOTE: border-width border-style border-color border-radius 默认 4个方向 一致
 *
 */

const BorderForm: React.FC<BorderFormProps> = ({ customPalette }) => (
  <Tabs type="text">
    <TabPane title="边框基础" key="border">
      <ItemsRow
        left={
          <FormItem label="宽度" field="border_width">
            <PxInputNumber />
          </FormItem>
        }
        right={
          <FormItem label="颜色" field="border_color">
            <CustomColorPicker
              presetColors={customPalette}
              showHexValue={false}
              allowClear
            />
          </FormItem>
        }
      />
      <ItemsRow
        left={
          <FormItem label="风格" field="border_style">
            <BorderStyleSelect />
          </FormItem>
        }
        right={
          <FormItem label="圆角" field="border_radius">
            <PxInputNumber />
          </FormItem>
        }
      />
    </TabPane>
    <TabPane title="整体阴影" key="box_shadow">
      <FormItem label="X-Y偏移" labelCol={{ span: 7 }}>
        <ItemsRow
          gutter={4}
          left={
            <FormItem field="box_shadow.x_offset">
              <PxInputNumber placeholder="X偏移" />
            </FormItem>
          }
          right={
            <FormItem field="box_shadow.y_offset">
              <PxInputNumber placeholder="Y偏移" />
            </FormItem>
          }
        />
      </FormItem>
      <FormItem label="模糊扩散" labelCol={{ span: 7 }}>
        <ItemsRow
          gutter={4}
          left={
            <FormItem field="box_shadow.blur_radius">
              <PxInputNumber placeholder="模糊" />
            </FormItem>
          }
          right={
            <FormItem field="box_shadow.spread_radius">
              <PxInputNumber placeholder="扩散" />
            </FormItem>
          }
        />
      </FormItem>
      <FormItem
        label="阴影颜色"
        field="box_shadow.color"
        labelCol={{ span: 7 }}
      >
        <CustomColorPicker
          presetColors={customPalette}
          showHexValue={false}
          allowClear
        />
      </FormItem>
    </TabPane>
  </Tabs>
)

export default BorderForm
