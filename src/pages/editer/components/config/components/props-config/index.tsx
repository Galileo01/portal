import * as React from 'react'

import { Collapse, Form, FormProps } from '@arco-design/web-react'

import { ComponentDataItem } from '@/typings/common/editer'
import { CommonProps } from '@/typings/common/resosurce-component'

import { ConfigPaneBaseProps, ConfigPaneNameEnum } from '../../config'
import { generatePropFormItems } from './utils'
import { devLogger } from '@/common/utils'

const { Item: CollapseItem } = Collapse

export type PropConfigProps = ConfigPaneBaseProps & {
  componentData?: ComponentDataItem
  updateComponentProps: (newProps: CommonProps) => void
}

const PropConfig: React.FC<PropConfigProps> = (props) => {
  const { active, componentData, updateComponentProps } = props

  const [form] = Form.useForm()

  const [formItems, setList] = React.useState<JSX.Element[]>([])

  const handlePropsChange: FormProps['onChange'] = (value, values) => {
    devLogger('PropConfig handlePropsChange', values)
    updateComponentProps(values)
  }

  React.useEffect(() => {
    if (componentData) {
      const elements = generatePropFormItems(componentData)
      setList(elements)
      // 先清空数据
      form.clearFields()
      // 更新 表单数据
      form.setFieldsValue(componentData?.resourceComponent.props)
    }
  }, [componentData, form])

  return (
    <CollapseItem
      header="属性配置"
      name={ConfigPaneNameEnum.PROPS_CONFIG}
      disabled={!active}
    >
      <Form
        form={form}
        size="small"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        labelAlign="left"
        onChange={handlePropsChange}
      >
        {formItems}
      </Form>
    </CollapseItem>
  )
}

export default PropConfig
