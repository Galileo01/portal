import * as React from 'react'

import { Grid } from '@arco-design/web-react'

import { createNewResourcePath } from '@/common/utils/route'
import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'
import User from '@/components/user'

import styles from './index.module.less'

const { Row, Col } = Grid

const navLinks = [
  {
    title: '首页',
    link: '',
  },
  {
    title: '编辑器',
    link: createNewResourcePath(),
  },
  {
    title: 'Github',
    link: 'https://github.com/Galileo01/portal',
    target: '_blank',
  },
]

const NavHeader = () => (
  <Row className={styles.nav_header} align="center">
    <Col span={2}>
      <Logo size={50} circle jumpWhenClick={false} />
    </Col>
    <Col span={2} offset={15} className={styles.navs}>
      {navLinks.map((nav) => (
        <a href={nav.link} target={nav.target} className={styles.nav_item}>
          {nav.title}
        </a>
      ))}
    </Col>
    <Col span={4} offset={1}>
      <Row className={styles.tools} align="center">
        <Col span={1}>
          <ThemeSwitch />
        </Col>
        <Col span={8} offset={1}>
          <User />
        </Col>
      </Row>
    </Col>
  </Row>
)

export default NavHeader
