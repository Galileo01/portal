import * as React from 'react'

import { Button, Avatar, Message } from '@arco-design/web-react'
import clsx from 'clsx'
import md5 from 'js-md5'

import {
  useUserInfo,
  useUserInfoDispatch,
  UserActionEnum,
} from '@/store/user-info'
import { UserBase } from '@/typings/request'
import { devLogger } from '@/common/utils'

import { getLocalStorage, setLocalStorage } from '@/common/utils/storage'
import { getUserInfo, login, updateUserInfo } from '@/network/user'

import CustomImage from '../custom-image'
import LoginModal, { LoginModalProps } from './login-modal'
import UserInfoPopover, { UserInfoPopoverProps } from './user-info-popover'
import styles from './index.module.less'

export type UserProps = {
  className?: string
}

const UserComponent: React.FC<UserProps> = (props) => {
  const { className } = props

  const [modalVisible, setVisible] = React.useState(false)

  const showLoginModal = () => {
    setVisible(true)
  }

  const hideLoginModal = () => {
    setVisible(false)
  }

  const userInfo = useUserInfo()
  const dispatch = useUserInfoDispatch()

  const updateUserInfoDispatch = (newUserInfo: UserBase) => {
    dispatch({
      type: UserActionEnum.SET_STATE,
      payload: newUserInfo,
    })
  }

  const handleLoginValidateSuccess: LoginModalProps['onValidateSuccess'] = (
    values
  ) => {
    const { name, password } = values
    login({
      name,
      password,
      // password: md5(password),
    }).then((res) => {
      if (res.success) {
        const { user, token, isRegister } = res.data
        updateUserInfoDispatch(user)
        setLocalStorage('token', token)
        Message.success(`${isRegister ? '注册' : '登陆'} 成功`)
        hideLoginModal()
      }
    })
  }

  const hanldeEditSubmitClick: UserInfoPopoverProps['onSubmitClick'] = (
    values
  ) => {
    devLogger('hanldeEditSubmitClick', values)
    const { password } = values
    updateUserInfo({
      ...values,
      password: password ? md5(password) : undefined,
    }).then((res) => {
      if (res.success) {
        devLogger('updateUserInfo', res.data)
        updateUserInfoDispatch(res.data)
        Message.success('更新成功')
      }
    })
  }

  const handleLogOut = () => {
    dispatch({
      type: UserActionEnum.CLEAR,
      payload: undefined,
    })
    setLocalStorage('token', '')
  }

  // 若 本地存储中存在token 则获取用户信息
  React.useEffect(() => {
    const token = getLocalStorage('token')
    if (token) {
      getUserInfo().then((res) => {
        if (res.success) {
          updateUserInfoDispatch(res.data)
        }
        // token 验证失败 清除token
        else {
          setLocalStorage('token', '')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={className}>
      {userInfo ? (
        <UserInfoPopover
          userInfo={userInfo}
          onSubmitClick={hanldeEditSubmitClick}
          onLogout={handleLogOut}
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
