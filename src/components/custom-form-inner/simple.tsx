import * as React from 'react'

import {
  Input,
  InputNumber,
  Select,
  Tooltip,
  SelectProps,
  InputProps,
  InputNumberProps,
} from '@arco-design/web-react'

import { IconQuestionCircle } from '@arco-design/web-react/icon'

export type CustomSelectFC = React.FC<SelectProps>

export type CustomInputFC = React.FC<InputProps>

export type CustomInputNumberFC = React.FC<InputNumberProps>

export const CustomNumberInput: CustomInputFC = (props) => (
  <Input maxLength={3} placeholder="0" {...props} />
)

export const PxInputNumber: CustomInputNumberFC = (props) => (
  <InputNumber suffix="px" {...props} />
)

export const FONT_LANGUAGE_OPTIONS = [
  {
    label: '中文',
    value: 'ch',
  },
  {
    label: '英文',
    value: 'en',
  },
]

export const FontLanguageSelect: CustomSelectFC = (props) => (
  <Select options={FONT_LANGUAGE_OPTIONS} allowClear {...props} />
)

export const FontSelect: CustomSelectFC = (props) => (
  <Select allowClear {...props} />
)

export const FONT_WEIGHT_ALIAS: Record<string, string> = {
  400: '正常',
  700: '加粗',
}

export const FONT_WEIGHT_OPTIONS = new Array(9).fill(0).map((n, index) => {
  const value = (index + 1) * 100
  const alias = FONT_WEIGHT_ALIAS[`${value}`]
  return {
    label: `${alias ? `${alias}` : value}`,
    value,
  }
})

export const FontWeightSelect: CustomSelectFC = (props) => (
  <Select options={FONT_WEIGHT_OPTIONS} allowClear {...props} />
)

export const TEXT_DECORATION_OPTIONS = [
  {
    label: '下划线',
    value: 'underline',
  },
  {
    label: '中划线',
    value: 'line-through',
  },
  {
    label: '上划线',
    value: 'overline',
  },
]

export const TextDecorationSelect: CustomSelectFC = (props) => (
  <Select options={TEXT_DECORATION_OPTIONS} allowClear {...props} />
)

export const TEXT_ALIGN_OPTIONS = [
  {
    label: '开始',
    value: 'start',
  },
  {
    label: '末尾',
    value: 'end',
  },
  {
    label: '左对齐',
    value: 'left',
  },
  {
    label: '右对齐',
    value: 'right',
  },
  {
    label: '居中',
    value: 'center',
  },
]

export const TextAlignSelect: CustomSelectFC = (props) => (
  <Select options={TEXT_ALIGN_OPTIONS} allowClear {...props} />
)

export const BORDER_STYLE_OPTIONS = [
  {
    label: '实线',
    value: 'solid',
  },
  {
    label: '圆点',
    value: 'dotted',
  },
  {
    label: '虚线',
    value: 'dashed',
  },

  {
    label: '双实线',
    value: 'double',
  },
  {
    label: '雕刻(内凹)',
    value: 'groove',
  },
  {
    label: '浮雕(外凸)',
    value: 'ridge',
  },
]

export const BorderStyleSelect: CustomSelectFC = (props) => (
  <Select options={BORDER_STYLE_OPTIONS} allowClear {...props} />
)

export const BACKGROUND_REPEAT_OPTIONS = [
  {
    label: '重复',
    value: 'repeat',
  },
  {
    label: '不重复',
    value: 'no-repeat',
  },
  {
    label: 'X轴重复',
    value: 'repeat-x',
  },
  {
    label: 'Y轴重复',
    value: 'repeat-y',
  },
]

export const BackgroundRepeatSelect: CustomSelectFC = (props) => (
  <Select options={BACKGROUND_REPEAT_OPTIONS} allowClear {...props} />
)

export const BACKGROUND_SIZE_OPTIONS = [
  {
    label: '自动',
    value: 'auto',
  },
  {
    label: '覆盖(可能拉伸)',
    value: 'cover',
  },
  {
    label: '容纳(可能空白)',
    value: 'contain',
  },
]

export const BackgroundSizeSelect: CustomSelectFC = (props) => (
  <Select options={BACKGROUND_SIZE_OPTIONS} allowClear {...props} />
)

export const BACKGROUND_CLIP_OPTIONS = [
  {
    label: '边框',
    value: 'broder-box',
  },
  {
    label: '内边距',
    value: 'padding-box',
  },
  {
    label: '内容',
    value: 'content-box',
  },
  {
    label: (
      <span>
        文字
        <Tooltip content="部分浏览器可能不生效">
          <IconQuestionCircle className="question_icon" />
        </Tooltip>
      </span>
    ),
    value: 'text',
  },
]

export const BackgroundClipSelect: CustomSelectFC = (props) => (
  <Select options={BACKGROUND_CLIP_OPTIONS} allowClear {...props} />
)

export const BACKGROUND_ATTACHMENT_OPTIONS = [
  {
    label: '相对视口固定',
    value: 'fixed',
  },
  {
    label: '跟随内容滚动',
    value: 'local',
  },
  {
    label: '相对元素固定',
    value: 'scroll',
  },
]

export const BackgroundAttachmentSelect: CustomSelectFC = (props) => (
  <Select options={BACKGROUND_ATTACHMENT_OPTIONS} allowClear {...props} />
)

export const BLEND_MODE_VALUES = [
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]

export const BLEND_MODE_OPTIONS = BLEND_MODE_VALUES.map((value) => ({
  value,
  label: value,
}))

export const BlendModeSelect: CustomSelectFC = (props) => (
  <Select options={BLEND_MODE_OPTIONS} allowClear {...props} />
)
