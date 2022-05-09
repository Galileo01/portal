import * as React from 'react'

import { Button, Avatar, Message } from '@arco-design/web-react'
import clsx from 'clsx'
import { User } from '@/typings/database'

import { devLogger } from '@/common/utils'

import CustomImage from '../custom-image'
import LoginModal, { LoginModalProps } from './login-modal'
import UserInfoPopover, { UserInfoPopoverProps } from './user-info-popover'
import styles from './index.module.less'

export type UserProps = {
  userInfo?: User
  className?: string
  updateUserInfo: (newUserInfo?: User) => void
}

const UserComponent: React.FC<UserProps> = (props) => {
  const { userInfo, className, updateUserInfo } = props

  const [modalVisible, setVisible] = React.useState(false)

  const showLoginModal = () => {
    setVisible(true)
  }

  const hideLoginModal = () => {
    setVisible(false)
  }

  const handleLoginValidateSuccess: LoginModalProps['onValidateSuccess'] = (
    values
  ) => {
    devLogger('handleValidateSuccess', values)
    // 发送 登陆请求
    Message.success('登陆成功')
    hideLoginModal()
  }

  const hanldeEditSubmitClick: UserInfoPopoverProps['onSubmitClick'] = (
    values
  ) => {
    updateUserInfo(values)
  }

  return (
    <div className={className}>
      {userInfo ? (
        <UserInfoPopover
          userInfo={userInfo}
          onSubmitClick={hanldeEditSubmitClick}
        >
          <Avatar className={clsx(styles.avatar_wrapper, 'cursor_pointer')}>
            {userInfo.avatar ? (
              <CustomImage src={userInfo.avatar} preview={false} />
            ) : (
              userInfo.name
            )}
          </Avatar>
        </UserInfoPopover>
      ) : (
        <div>
          <Button type="text" size="small" onClick={showLoginModal}>
            登陆
          </Button>
          <LoginModal
            visible={modalVisible}
            footer={null}
            onCancel={hideLoginModal}
            onValidateSuccess={handleLoginValidateSuccess}
          />
        </div>
      )}
    </div>
  )
}

export default UserComponent
