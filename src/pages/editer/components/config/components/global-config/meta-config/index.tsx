import * as React from 'react'

import {
  Form,
  Collapse,
  Input,
  InputTag,
  FormProps,
} from '@arco-design/web-react'

import HelpTip from '@/components/help-tip'
import { useGlobalConfig } from '@/common/hooks/editer-data'

const { Item: CollapseItem } = Collapse
const { Item: FormItem } = Form
const { TextArea } = Input

const MetaConfig = () => {
  const { configData, updateGlobalConfig } = useGlobalConfig()

  const [metaForm] = Form.useForm()

  const handleValuesChange: FormProps['onValuesChange'] = (_, values) => {
    updateGlobalConfig({
      metaConfig: values,
    })
  }

  return (
    <CollapseItem header="元信息配置" name="global_config.meta_config">
      <Form
        form={metaForm}
        labelAlign="left"
        autoComplete="off"
        size="small"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={configData?.metaConfig}
        onValuesChange={handleValuesChange}
      >
        <div
          className="tip_text"
          style={{
            marginBottom: 10,
          }}
        >
          需要在预览页面或者发布后查看效果
        </div>
        <FormItem label="网站icon" field="favicon">
          <Input placeholder="https:xxxxx.com" allowClear />
        </FormItem>
        <FormItem label="作者" field="meta.author">
          <Input allowClear />
        </FormItem>
        <FormItem
          label={
            <>
              描述
              <HelpTip content="帮助搜索引擎理解页面内容" />
            </>
          }
          field="meta.description"
        >
          <TextArea placeholder="对页面内容的描述" allowClear />
        </FormItem>
        <FormItem
          label={
            <>
              关键词
              <HelpTip content="帮助搜索引擎对网页进行分类;支持多个" />
            </>
          }
          field="meta.keywords"
        >
          <InputTag allowClear />
        </FormItem>
      </Form>
    </CollapseItem>
  )
}

export default MetaConfig
