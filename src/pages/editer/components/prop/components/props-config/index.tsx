import * as React from 'react'

import { Collapse, Form, FormProps } from '@arco-design/web-react'

import { ComponentDataItem } from '@/typings/editer'
import { devLogger } from '@/common/utils'

import { generatePropFormItems } from './utils'

const { Item: CollapseItem } = Collapse

export type PropConfigProps = {
  componentData?: ComponentDataItem
  updateComponentProps: (newProps: object) => void
}

const PropConfig: React.FC<PropConfigProps> = ({
  componentData,
  updateComponentProps,
}) => {
  const [form] = Form.useForm()

  const [formItems, setList] = React.useState<JSX.Element[]>([])

  const handlePropsChange: FormProps['onValuesChange'] = (value, values) => {
    devLogger('handlePropsChange', 'value', value, 'values', values)
    updateComponentProps(values)
  }

  React.useEffect(() => {
    if (componentData) {
      const elements = generatePropFormItems(componentData)
      devLogger('PropConfig  generatePropFormItems', elements)
      setList(elements)
      // 更新 表单数据
      form.setFieldsValue(componentData?.resourceComponent.props)
    }
  }, [componentData, form])

  return (
    <CollapseItem header="属性配置" name="prop_config">
      <Form
        form={form}
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 16,
        }}
        labelAlign="left"
        initialValues={componentData?.resourceComponent.props}
        onValuesChange={handlePropsChange}
      >
        {formItems}
      </Form>
    </CollapseItem>
  )
}

export default PropConfig
