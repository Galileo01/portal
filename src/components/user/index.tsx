import * as React from 'react'

import { Button, Avatar, Message } from '@arco-design/web-react'
import clsx from 'clsx'
import md5 from 'js-md5'

import {
  Store,
  useUserInfo,
  useUserInfoDispatch,
  UserActionEnum,
} from '@/store/user-info'
import { devLogger, HAS_TOKEN } from '@/common/utils'
import { LOSTORAGE_KEY_TOKEN } from '@/common/constant'
import { setLocalStorage } from '@/common/utils/storage'
import { getUserInfo, login, updateUserInfo } from '@/network/user'
import { uploadCos } from '@/network/cos'

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

  const updateUserInfoDispatch = React.useCallback(
    (newUserInfo: Store) => {
      dispatch({
        type: UserActionEnum.SET_STATE,
        payload: newUserInfo,
      })
    },
    [dispatch]
  )

  const fetchUserInfo = React.useCallback(() => {
    getUserInfo().then((res) => {
      if (res.success) {
        updateUserInfoDispatch(res.data)
      }
    })
  }, [updateUserInfoDispatch])

  const handleLoginValidateSuccess: LoginModalProps['onValidateSuccess'] = (
    values
  ) => {
    const { name, password } = values
    login({
      name,
      password: md5(password),
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

  const hanldeEditSubmitClick: UserInfoPopoverProps['onSubmitClick'] = async (
    values
  ) => {
    const { password, avatarImg, ...resetValues } = values
    let avatarCOSUrl: undefined | string
    if (values.avatarImg) {
      // 点击确认时 才上传至 腾讯云 cos
      avatarCOSUrl = await uploadCos(values.avatarImg, values.avatarImg.name)
    }

    updateUserInfo({
      ...resetValues,
      avatar: avatarCOSUrl,
      password: password ? md5(password) : undefined,
    }).then((res) => {
      if (res.success) {
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
    // 清空本地缓存
    setLocalStorage('page_configs', '')
  }

  const handleStorage = React.useCallback<(e: StorageEvent) => void>(
    (e) => {
      if (e.key === LOSTORAGE_KEY_TOKEN) {
        devLogger('handleStorage in user', e)
        // 若token 存在新的有效值
        if (e.newValue) {
          fetchUserInfo()
        }
        // 否则 为 登出操作，清空
        else {
          updateUserInfoDispatch(undefined)
        }
      }
    },
    [fetchUserInfo, updateUserInfoDispatch]
  )

  // 第一次渲染 时，若 本地存储中存在token 则获取用户信息
  React.useEffect(() => {
    if (HAS_TOKEN) {
      fetchUserInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // storage 事件 触发 更新 用户信息
  React.useEffect(() => {
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [handleStorage])

  return (
    <div className={className}>
      {userInfo ? (
        <UserInfoPopover
          userInfo={userInfo}
          onSubmitClick={hanldeEditSubmitClick}
          onLogout={handleLogOut}
        >
          <Avatar
            className={clsx(
              styles.avatar_wrapper,
              'cursor_pointer',
              userInfo.avatar && styles.avatar_wrapper_un_scale
            )}
          >
            {userInfo.avatar ? (
              <CustomImage src={userInfo.avatar} height={40} width={40} />
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
