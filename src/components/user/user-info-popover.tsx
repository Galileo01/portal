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
import { UserBase } from '@/typings/request'

import CustomImage from '../custom-image'

import styles from './index.module.less'

const { Item: FormItem } = Form

export type EditField = {
  avatar: string
  name: string
  password: string
}

export type SubmitData = EditField & {
  avatarImg?: File
}

export type UserInfoPopoverProps = {
  userInfo: UserBase
  onSubmitClick: (values: Partial<SubmitData>) => void
  onLogout: () => void
}

const initEditedMap = {
  avatar: false,
  name: false,
  password: false,
}

const UserInfoPopover: React.FC<UserInfoPopoverProps> = (props) => {
  const { userInfo, onSubmitClick, onLogout, children } = props

  const [imgFile, setImgFile] = React.useState<UploadItem>({
    uid: 'init',
    url: userInfo.avatar,
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
    revokeUrl()
    setImgFile({
      ...currentFile,
      url: currentFile.originFile
        ? URL.createObjectURL(currentFile.originFile)
        : undefined,
    })
    setEdited((pre) => ({ ...pre, avatar: true }))
    editForm.resetFields()
  }

  const resetData = () => {
    editForm.resetFields()
    setEdited(initEditedMap)
    revokeUrl()
    setImgFile({
      uid: 'init',
      url: userInfo.avatar,
    })
  }

  const handleVisibleChange: PopoverProps['onVisibleChange'] = (visible) => {
    if (!visible) {
      resetData()
    }
  }

  const handleSubmitClick = () => {
    const values = editForm.getFieldsValue()
    onSubmitClick({
      avatarImg: imgFile?.originFile,
      ...userInfo,
      ...values,
    })
    resetData()
  }

  return (
    <Popover
      trigger="click"
      position="bottom"
      style={{ width: 240 }}
      onVisibleChange={handleVisibleChange}
      content={
        <div className={styles.user_info_pop}>
          <Form
            form={editForm}
            size="mini"
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={userInfo}
            autoComplete="off"
          >
            <FormItem label="??????">
              <div className={styles.item_inner_wrapper}>
                <Avatar className={styles.avatar_wrapper_un_scale}>
                  <CustomImage src={imgFile.url} height={40} width={40} />
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
            <FormItem label="?????????">
              <div className={styles.item_inner_wrapper}>
                {editedMap.name ? (
                  <FormItem field="name">
                    <Input allowClear />
                  </FormItem>
                ) : (
                  <span>{userInfo.name}</span>
                )}
                <IconEdit
                  className="cursor_pointer"
                  onClick={editedMapSwitchGenerator('name')}
                />
              </div>
            </FormItem>
            <FormItem label="??????">
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
          <div className={styles.btn_wrapper}>
            {oneFiledEditing && (
              <Button
                size="mini"
                onClick={handleSubmitClick}
                className={styles.submit_edit_btn}
              >
                ??????
              </Button>
            )}
            <Button size="mini" status="danger" onClick={onLogout}>
              ??????
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  )
}

export default UserInfoPopover
