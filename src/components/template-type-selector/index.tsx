import * as React from 'react'

import {
  Radio,
  Select,
  SelectProps,
  RadioGroupProps,
} from '@arco-design/web-react'

const { Group: RadioGroup } = Radio

export const typeOptions = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '我的',
    value: 'private',
  },
  {
    label: '共享',
    value: 'public',
  },
  {
    label: '平台',
    value: 'platform',
  },
]

const TemplateTypeRadio: React.FC<RadioGroupProps> = (props) => (
  <RadioGroup type="button" {...props}>
    {typeOptions.map(({ label, value }) => (
      <Radio value={value} key={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
)

export default TemplateTypeRadio

export const TemplateTypeSelect: React.FC<SelectProps> = (props) => (
  <Select options={typeOptions} {...props} />
)

export const templeteOrderOptions = [
  {
    label: '时间',
    value: 'lastModified',
  },
  {
    label: '标题',
    value: 'title',
  },
]

export const TemplateOrderSelect: React.FC<SelectProps> = (props) => (
  <Select options={templeteOrderOptions} {...props} />
)
