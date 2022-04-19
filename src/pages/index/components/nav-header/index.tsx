import * as React from 'react'

import { Grid, Avatar, Button } from '@arco-design/web-react'

import { ROUTE_EDITER, ROUTE_LOGIN } from '@/common/constant/route'
import { getUniqueId } from '@/common/utils'
import Logo from '@/components/logo'
import ThemeSwitch from '@/components/theme-switch'

import styles from './index.module.less'

const { Row, Col } = Grid
// 4.17-1 TODO: 创建 新页面的逻辑放到 index
const newUniquePageId = getUniqueId()

const navLinks = [
  {
    title: '首页',
    link: '',
  },
  {
    title: '编辑器',
    link: `${ROUTE_EDITER}?page_id=${newUniquePageId}&edite_type=create`,
  },
  {
    title: 'Github',
    link: 'https://github.com/Galileo01/portal',
    target: '_blank',
  },
]

const NavHeader = () => {
  const isLogin = false

  return (
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
            {isLogin ? (
              <Avatar />
            ) : (
              <Button type="text" size="small">
                <a href={ROUTE_LOGIN}>登陆</a>
              </Button>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default NavHeader
