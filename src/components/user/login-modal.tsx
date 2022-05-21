import * as React from 'react'

import { Modal, Button, Form, Input, ModalProps } from '@arco-design/web-react'
import clsx from 'clsx'

import styles from './index.module.less'

const { Item: FormItem } = Form

export type LoginFormField = { name: string; password: string }

export type LoginModalProps = ModalProps & {
  onValidateSuccess: (values: LoginFormField) => void
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { visible, onValidateSuccess, ...reset } = props

  const [loginForm] = Form.useForm<LoginFormField>()

  const handleLoginSubmit = () => {
    loginForm.validate((errors, values) => {
      if (!errors && values) {
        onValidateSuccess(values)
      }
    })
  }

  React.useEffect(() => {
    if (!visible) {
      loginForm.resetFields()
    }
  }, [visible, loginForm])

  return (
    <Modal
      title="登陆"
      style={{
        width: 340,
      }}
      visible={visible}
      {...reset}
    >
      <Form form={loginForm} wrapperCol={{ span: 24 }} autoComplete="off">
        <FormItem
          field="name"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input placeholder="用户名" />
        </FormItem>
        <FormItem
          field="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password placeholder="密码" />
        </FormItem>
        <div className={styles.submit_btn_wrapper}>
          <Button type="primary" onClick={handleLoginSubmit}>
            登陆/注册
          </Button>
        </div>
        <div className={clsx('tip_text', styles.login_tip)}>
          未注册用户自动注册
        </div>
      </Form>
    </Modal>
  )
}

export default LoginModal
