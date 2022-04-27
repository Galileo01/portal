import * as React from 'react'

import { Modal, Form, Input, Radio, ModalProps } from '@arco-design/web-react'
import domtoimage from 'dom-to-image'

import CustomImage from '@/components/custom-image'
import { devLogger } from '@/common/utils'
import { getPreviewerElement } from '@/common/utils/element'

export type PublishForm = {
  resourceID: string
  private: string
  resourceType: string
  thumbnailUrl: string
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

// TODO: 4.20-1 发布时 判断如果是 平台管理员 则展示 template_type 选择,或者 放到服务端 做？
const PublishModal: React.FC<PublishModalProps> = (props) => {
  const { pageId, visible, onConfirm, ...rest } = props

  const [publishForm] = Form.useForm<PublishForm>()
  const [thumbnail, setThumbnail] = React.useState('')

  // 展示  设置默认值
  const generateThumbnail = React.useCallback(() => {
    const previewerElement = getPreviewerElement()
    if (previewerElement) {
      domtoimage.toPng(previewerElement).then((imgUrl) => {
        devLogger('domtoimage imgUrl', imgUrl)
        setThumbnail(imgUrl)
        // TODO: 使用 腾讯云 对象存储  临时使用 dataURL
        publishForm.setFieldValue('thumbnailUrl', imgUrl)
      })
    }
  }, [publishForm])

  const hanldeConfirm = () => {
    publishForm.validate((error, values) => {
      if (!error && values) {
        onConfirm(values as PublishForm)
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      publishForm.setFieldsValue({
        resourceID: pageId,
        private: '1',
        resourceType: 'page',
      })
      generateThumbnail()
    } else {
      publishForm.resetFields()
    }
  }, [generateThumbnail, publishForm, visible, pageId])

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
        <FormItem label="缩略图" field="thumbnailUrl">
          <CustomImage src={thumbnail} width={200} />
        </FormItem>
      </Form>
    </Modal>
  )
}
export default PublishModal
