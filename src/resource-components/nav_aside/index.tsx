import * as React from 'react'

import { RCClassnameComputer } from '@/common/utils/element'
import { RESOURCE_COMPONENT_ABSOLUTE_CONTAINER_CLASS } from '@/common/constant'
import { CommonProps } from '@/typings/common/resosurce-component'
import CustomImage from '@/components/custom-image'

import styles from './index.module.less'

export type NavAsideProps = CommonProps & {
  position?: 'right' | 'left'
  top?: string
  scrollSmooth?: boolean
  titleMode?: 'text' | 'img'
  navList: Array<{
    title: string
    id: string
  }>
}

const NavAside: React.FC<NavAsideProps> = (props) => {
  const {
    top = '50%',
    position = 'right',
    scrollSmooth,
    titleMode = 'text',
    navList,
    ...reset
  } = props

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      'scroll-behavior',
      scrollSmooth ? 'smooth' : 'revert'
    )
  }, [scrollSmooth])

  return (
    <div
      className={RCClassnameComputer(
        RESOURCE_COMPONENT_ABSOLUTE_CONTAINER_CLASS,
        styles.nav_aside,
        styles[position]
      )}
      style={{
        top,
      }}
      {...reset}
    >
      {navList.map((navItem) => (
        <a
          className={styles.nav_item}
          href={`#${navItem.id}`}
          data-target-id={`#${navItem.id}`}
          key={navItem.id}
        >
          {titleMode === 'text' ? (
            navItem.title
          ) : (
            <CustomImage
              src={navItem.title}
              width={30}
              height={30}
              preview={false}
            />
          )}
        </a>
      ))}
    </div>
  )
}

export default NavAside
