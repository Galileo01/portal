import * as React from 'react'

import {
  Modal,
  Form,
  Input,
  Radio,
  ModalProps,
  Spin,
} from '@arco-design/web-react'
import html2canvas from 'html2canvas'

import CustomImage from '@/components/custom-image'
import { devLogger } from '@/common/utils'
import { getPreviewerElement } from '@/common/utils/element'
import { ResourceType } from '@/typings/database'

export type PublishForm = {
  resourceId: string
  title: string
  private: number
  resourceType: ResourceType
  thumbnail: Blob
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

const PublishModal: React.FC<PublishModalProps> = (props) => {
  const { resourceId, resourceType, visible, title, onConfirm, ...rest } = props

  const initialValues = React.useMemo(
    () => ({
      resourceId,
      private: 1,
      resourceType: resourceType as ResourceType,
      title: title || resourceId,
    }),
    [resourceId, resourceType, title]
  )

  const [publishForm] = Form.useForm<PublishForm>()
  const [thumbnailInfo, setThumbnailInfo] = React.useState<{
    img: Blob
    url: string
  }>()

  // 展示  设置默认值
  const generateThumbnail = React.useCallback(() => {
    const previewerElement = getPreviewerElement()
    if (previewerElement) {
      html2canvas(previewerElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            devLogger('html2canvas', blob, URL.createObjectURL(blob))
            setThumbnailInfo({
              img: blob,
              url: canvas.toDataURL(),
            })
          }
        })
      })
    }
  }, [])

  const hanldeConfirm = () => {
    publishForm.validate((error, values) => {
      if (!error && values && thumbnailInfo) {
        onConfirm({
          ...values,
          thumbnail: thumbnailInfo?.img,
        })
      } else {
        devLogger('publishForm.validate', error, values)
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      generateThumbnail()
    } else {
      publishForm.resetFields()
      setThumbnailInfo(undefined)
    }
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
        <FormItem label="缩略图" field="thumbnail">
          <Spin style={{ display: 'block' }} loading={!thumbnailInfo?.url}>
            <CustomImage
              src={thumbnailInfo?.url}
              width={200}
              style={{
                border: '1px solid var(--color-text-4)',
              }}
            />
          </Spin>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default PublishModal
