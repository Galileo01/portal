import * as React from 'react'

import {
  Form,
  Input,
  Avatar,
  Popover,
  Button,
  Upload,
  PopoverProps,
  UploadProps,
} from '@arco-design/web-react'
import { UploadItem } from '@arco-design/web-react/es/Upload/interface'
import { IconEdit } from '@arco-design/web-react/icon'
import { UserInfo } from '@/@types/portal-network'

import { devLogger } from '@/common/utils'
import CustomImage from '../custom-image'

import styles from './index.module.less'

const { Item: FormItem } = Form

export type EditField = {
  avatar: string
  name: string
  password: string
}

export type UserInfoPopoverProps = {
  userInfo?: UserInfo
  onSubmitClick: (values: Partial<EditField>) => void
}

const initEditedMap = {
  avatar: false,
  name: false,
  password: false,
}

const UserInfoPopover: React.FC<UserInfoPopoverProps> = (props) => {
  const { userInfo, onSubmitClick, children } = props

  const [imgFile, setImgFile] = React.useState<UploadItem>({
    uid: 'init',
    url: userInfo?.avatar,
  })

  const [editForm] = Form.useForm<EditField>()

  const [editedMap, setEdited] = React.useState(initEditedMap)

  const oneFiledEditing = React.useMemo(
    () => editedMap.avatar || editedMap.name || editedMap.password,
    [editedMap]
  )

  const editedMapSwitchGenerator = (field: keyof EditField) => () => {
    setEdited((preValues) => {
      const preValue = preValues[field]
      return {
        ...preValues,
        [field]: !preValue,
      }
    })
  }

  const revokeUrl = () => {
    if (imgFile?.url) {
      URL.revokeObjectURL(imgFile?.url)
    }
  }

  const handleUplaodChange: UploadProps['onChange'] = (_, currentFile) => {
    devLogger('handleUplaodChange', currentFile)
    revokeUrl()
    setImgFile({
      ...currentFile,
      url: currentFile.originFile
        ? URL.createObjectURL(currentFile.originFile)
        : undefined,
    })
    // TODO:   腾讯云 对象存储
    // editForm.setFieldValue('')
    setEdited((pre) => ({ ...pre, avatar: true }))
  }

  const handleVisibleChange: PopoverProps['onVisibleChange'] = (visible) => {
    devLogger('onVisibleChange', visible)
    if (!visible) {
      editForm.resetFields()
      setEdited(initEditedMap)
      setImgFile({
        uid: 'init',
        url: userInfo?.avatar,
      })
    }
  }

  const handleSubmitClick = () => {
    const values = editForm.getFieldsValue()
    devLogger('handleSubmitClick', values)
    onSubmitClick(values)
  }

  return (
    <Popover
      trigger="click"
      position="bottom"
      style={{ width: 240 }}
      content={
        <div className={styles.user_info_pop}>
          <Form
            form={editForm}
            size="mini"
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={userInfo}
          >
            <FormItem label="头像">
              <div className={styles.item_inner_wrapper}>
                <Avatar className={styles.avatar_wrapper}>
                  <CustomImage src={imgFile.url} />
                </Avatar>
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  onChange={handleUplaodChange}
                >
                  <IconEdit className="cursor_pointer" />
                </Upload>
              </div>
            </FormItem>
            <FormItem label="用户名">
              <div className={styles.item_inner_wrapper}>
                {editedMap.name ? (
                  <FormItem field="name">
                    <Input allowClear />
                  </FormItem>
                ) : (
                  <span>{userInfo?.name}</span>
                )}
                <IconEdit
                  className="cursor_pointer"
                  onClick={editedMapSwitchGenerator('name')}
                />
              </div>
            </FormItem>
            <FormItem label="密码">
              <div className={styles.item_inner_wrapper}>
                {editedMap.password ? (
                  <FormItem field="password">
                    <Input.Password allowClear />
                  </FormItem>
                ) : (
                  <span>******</span>
                )}
                <IconEdit
                  className="cursor_pointer"
                  onClick={editedMapSwitchGenerator('password')}
                />
              </div>
            </FormItem>
          </Form>
          {oneFiledEditing && (
            <div className={styles.submit_edit_btn_wrapper}>
              <Button size="mini" onClick={handleSubmitClick}>
                提交编辑
              </Button>
            </div>
          )}
        </div>
      }
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </Popover>
  )
}

export default UserInfoPopover
