import * as React from 'react'

import Logo from '@/components/logo'

import styles from './index.module.less'

const Introduce = () => (
  <section className={styles.introduce}>
    <Logo showText={false} size={200} circle />
    <div className={styles.intro_text}>
      <p>Portal 是一个网页搭建工具</p>
      <p>
        提供一系列源组件和模板,内建了可视化搭建编辑器,允许用户上传和共享自己构建的应用模板,支持用户自定义主题色
      </p>
    </div>
  </section>
)

export default Introduce
