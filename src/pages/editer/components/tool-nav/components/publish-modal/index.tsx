import * as React from 'react'

import { Modal, Form, Input, Radio, ModalProps } from '@arco-design/web-react'

export type PublishForm = {
  resourceID: string
  private: string
  resourceType: string
}

export type PublishModalProps = Omit<ModalProps, 'onConfirm'> & {
  pageId: string
  onConfirm: (values: PublishForm) => void
}

const { Item: FormItem } = Form
const { Group: RadioGruop } = Radio

const privateSelectRenderer = (values: any) => {
  if (values.resourceType === 'template') {
    return (
      <FormItem field="private" label="访问权限">
        <RadioGruop>
          <Radio value="1">私有</Radio>
          <Radio value="0">公有</Radio>
        </RadioGruop>
      </FormItem>
    )
  }
  return null
}

const PublishModal: React.FC<PublishModalProps> = (props) => {
  const { pageId, visible, onConfirm, ...rest } = props

  const [publishForm] = Form.useForm()

  const hanldeConfirm = () => {
    publishForm.validate((error, values) => {
      if (!error && values) {
        onConfirm(values as PublishForm)
      }
    })
  }

  React.useEffect(() => {
    // 展示  设置默认值
    if (visible) {
      publishForm.setFieldsValue({
        resourceID: pageId,
        private: '1',
        resourceType: 'page',
      })
    } else {
      publishForm.resetFields()
    }
  }, [publishForm, pageId, visible])

  return (
    <Modal title="发布" visible={visible} onConfirm={hanldeConfirm} {...rest}>
      <Form form={publishForm} wrapperCol={{ span: 12 }} labelAlign="left">
        <FormItem
          field="resourceID"
          label="资源id"
          defaultValue={pageId}
          disabled
        >
          <Input allowClear />
        </FormItem>
        <FormItem
          field="resourceName"
          label="资源名称"
          rules={[
            {
              required: true,
              message: '请填写资源名称',
            },
          ]}
        >
          <Input allowClear />
        </FormItem>
        <FormItem field="resourceType" label="资源类型">
          <RadioGruop>
            <Radio value="page">页面</Radio>
            <Radio value="template">模板</Radio>
          </RadioGruop>
        </FormItem>
        <FormItem shouldUpdate noStyle>
          {privateSelectRenderer}
        </FormItem>
      </Form>
    </Modal>
  )
}
export default PublishModal
