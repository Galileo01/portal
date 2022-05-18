import * as React from 'react'

import { Modal, Form, Input, Radio, ModalProps } from '@arco-design/web-react'
import domtoimage from 'dom-to-image'

import CustomImage from '@/components/custom-image'
import { devLogger } from '@/common/utils'
import { getPreviewerElement } from '@/common/utils/element'
import { ResourceType } from '@/typings/database'

export type PublishForm = {
  resourceId: string
  title: string
  private: number
  resourceType: ResourceType
  thumbnailUrl: string
}

export type PublishModalProps = Omit<ModalProps, 'onConfirm'> & {
  resourceId: string
  resourceType: string
  title?: string
  onConfirm: (values: PublishForm) => void
}

const { Item: FormItem } = Form
const { Group: RadioGruop } = Radio

const privateSelectRenderer = (values: any) => {
  if (values.resourceType === 'template') {
    return (
      <FormItem field="private" label="访问权限">
        <RadioGruop>
          <Radio value={1}>私有</Radio>
          <Radio value={0}>公有</Radio>
        </RadioGruop>
      </FormItem>
    )
  }
  return null
}

// TODO: 510 解决 dom-to-image 跨域问题
const PublishModal: React.FC<PublishModalProps> = (props) => {
  const { resourceId, resourceType, visible, title, onConfirm, ...rest } = props

  const initialValues = React.useMemo(
    () => ({
      resourceId,
      private: 1,
      resourceType: resourceType as ResourceType,
      title,
    }),
    [resourceId, resourceType, title]
  )

  const [publishForm] = Form.useForm<PublishForm>()
  const [thumbnail, setThumbnail] = React.useState('')

  // 展示  设置默认值
  const generateThumbnail = React.useCallback(() => {
    const previewerElement = getPreviewerElement()
    if (previewerElement) {
      domtoimage
        .toPng(previewerElement)
        .then((imgUrl) => {
          devLogger('domtoimage imgUrl', imgUrl)
          setThumbnail(imgUrl)
          // TODO: 使用 腾讯云 对象存储  临时使用 dataURL

          publishForm.setFieldValue('thumbnailUrl', imgUrl)
        })
        // TODO: 解决跨域问题
        .finally(() => {
          const tempUrl =
            'https://cos-01-1303103441.cos.ap-chengdu.myqcloud.com/img/portal/6480dbc69be1b5de95010289787d64f1.png_tplv-uwbnlip3yd-webp.webp'
          publishForm.setFieldValue('thumbnailUrl', tempUrl)
        })
    }
  }, [publishForm])

  const hanldeConfirm = () => {
    publishForm.validate((error, values) => {
      if (!error && values) {
        onConfirm(values as PublishForm)
      } else {
        devLogger('publishForm.validate', error, values)
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      generateThumbnail()
    }
    publishForm.resetFields()
  }, [generateThumbnail, publishForm, visible])

  return (
    <Modal title="发布" visible={visible} onConfirm={hanldeConfirm} {...rest}>
      <Form
        form={publishForm}
        wrapperCol={{ span: 12 }}
        labelAlign="left"
        autoComplete="off"
        initialValues={initialValues}
        size="small"
      >
        <FormItem
          field="resourceId"
          label="资源id"
          defaultValue={resourceId}
          disabled
        >
          <Input allowClear />
        </FormItem>
        <FormItem
          field="title"
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
          <CustomImage
            src={thumbnail}
            width={200}
            style={{
              border: '1px solid var(--color-text-4)',
            }}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default PublishModal
