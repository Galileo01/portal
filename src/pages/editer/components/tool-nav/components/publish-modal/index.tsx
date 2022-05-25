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
import HelpTip from '@/components/help-tip'
import { devLogger } from '@/common/utils'
import { getPreviewerElement } from '@/common/utils/element'
import { ResourceType, TemplateType, Template } from '@/typings/database'
import { useUserInfo } from '@/store/user-info'
import { useFetchDataStore } from '@/store/fetch-data'

export type PublishForm = {
  resourceId: string
  title: string
  resourceType: ResourceType
  thumbnail: Blob
  private?: number
  type?: TemplateType
}

export type PublishModalProps = Omit<ModalProps, 'onConfirm'> & {
  resourceId: string
  resourceType: string
  fetching: boolean
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
  const { resourceId, resourceType, visible, fetching, onConfirm, ...rest } =
    props

  const userInfo = useUserInfo()
  const useFetchData = useFetchDataStore()

  const initialValues = React.useMemo(
    () => ({
      resourceId,
      private: (useFetchData?.resource as Template | undefined)?.private ?? 1,
      resourceType: resourceType as ResourceType,
      title: useFetchData?.resource?.title || resourceId,
    }),
    [resourceId, resourceType, useFetchData?.resource]
  )

  const [publishForm] = Form.useForm<PublishForm>()
  const [thumbnailInfo, setThumbnailInfo] = React.useState<{
    img: Blob
    url: string
  }>()

  const loading = fetching || !thumbnailInfo?.url

  // 展示  设置默认值
  const generateThumbnail = React.useCallback(() => {
    const previewerElement = getPreviewerElement()
    if (previewerElement) {
      html2canvas(previewerElement).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
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
        const { resourceType: resourceTypeInValues } = values
        const finallyValues = { ...values, thumbnail: thumbnailInfo?.img }
        // 资源类型为 模板
        if (resourceTypeInValues === 'template') {
          devLogger('userInfo', userInfo)
          //  模板为公有 且用户角色是 admin ，自动填充 type
          finallyValues.type = userInfo?.role === 'admin' ? 'platform' : 'user'
        }

        onConfirm(finallyValues)
      } else {
        devLogger('publishForm.validate', error, values)
      }
    })
  }

  React.useEffect(() => {
    if (visible) {
      generateThumbnail()
    } else {
      publishForm.setFieldsValue(initialValues)
      setThumbnailInfo(undefined)
    }
  }, [generateThumbnail, publishForm, visible, initialValues])

  return (
    <Modal title="发布" visible={visible} onConfirm={hanldeConfirm} {...rest}>
      <Spin loading={loading} dot style={{ display: 'block' }}>
        <Form
          form={publishForm}
          wrapperCol={{ span: 12 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
          autoComplete="off"
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
            label={
              <>
                资源名称
                <HelpTip content="显示为页面或模板的名称" />
              </>
            }
            rules={[
              {
                required: true,
                message: '请填写资源名称',
              },
              {
                maxLength: 20,
                message: '最大长度为20',
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
            <CustomImage
              src={thumbnailInfo?.url}
              width={200}
              style={{
                border: '1px solid var(--color-text-4)',
              }}
            />
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

export default PublishModal
