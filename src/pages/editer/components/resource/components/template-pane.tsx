import * as React from 'react'

import {
  Input,
  Grid,
  Form,
  Spin,
  Card,
  Empty,
  Divider,
  Button,
  FormProps,
} from '@arco-design/web-react'
import { IconPlus, IconEye } from '@arco-design/web-react/icon'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import {
  TemplateTypeSelect,
  TemplateOrderSelect,
} from '@/components/template-type-selector'
import CustomImage from '@/components/custom-image'
import { GetResourceListQuery } from '@/typings/request'
import { dispatchTemplateImportEvent } from '@/common/utils/custom-event'
import { useRefreshWhenUserUpdate } from '@/common/hooks/user'
import { useFetchResrouceList } from '@/common/hooks/fetch-resource'
import { generatePagePath } from '@/common/utils/route'

import styles from './index.module.less'

const { Search } = Input

const { Row, Col } = Grid

const { Item: FormItem } = Form

type QueryForm = {
  filter: GetResourceListQuery['filter']
  order: GetResourceListQuery['order']
  titleLike?: string
}

const initialQuery: QueryForm = {
  filter: 'all',
  order: 'lastModified',
}

const TemplatePane = () => {
  const [queryForm] = Form.useForm<QueryForm>()

  const triggerElementRef = React.useRef(null)

  const {
    loading,
    resourceListRes,
    fetchResourceList,
    hanldeLoadMore,
    handleRefresh,
  } = useFetchResrouceList({ resourceType: 'template', size: 5 })

  const fetchWithFrom = () => {
    const values = queryForm.getFieldsValue()
    fetchResourceList('init', values)
  }

  const loadMoreWithForm = React.useCallback(() => {
    const values = queryForm.getFieldsValue()
    hanldeLoadMore(values)
  }, [hanldeLoadMore, queryForm])

  const handleFormChange: FormProps<QueryForm>['onChange'] = (value) => {
    // 不是 输入框的变化 引起的 才触发请求
    if (!value.titleLike) {
      fetchWithFrom()
    }
  }

  const generateImportHandler = (resourceId: string) => () => {
    dispatchTemplateImportEvent(resourceId)
  }

  React.useEffect(() => {
    fetchWithFrom()
    // 第一次渲染才请求
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRefreshWhenUserUpdate({
    onRefresh: handleRefresh,
  })

  // 加载更多
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    const triggerElement = triggerElementRef.current
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const { intersectionRatio } = entries[0]
      // // 排除 triggerElement 一开始 就可见的情况，很常见
      if (intersectionRatio > 0) {
        loadMoreWithForm()
      }
    }

    const observer = new IntersectionObserver(observerCallback)
    if (triggerElement) {
      observer.observe(triggerElement)
      return () => {
        // 停止观察
        observer.unobserve(triggerElement)
      }
    }
  }, [loadMoreWithForm])

  return (
    <div className={styles.resource_pane}>
      <Form
        form={queryForm}
        className={styles.filter_wrapper}
        initialValues={initialQuery}
        labelAlign="left"
        labelCol={{
          span: 7,
        }}
        wrapperCol={{
          span: 17,
        }}
        onChange={handleFormChange}
      >
        <FormItem noStyle field="titleLike">
          <Search
            searchButton
            placeholder="输入关键词进行模糊查询"
            style={{ width: '90%' }}
            size="small"
            onSearch={fetchWithFrom}
            allowClear
          />
        </FormItem>
        <Row className={styles.filter} gutter={10}>
          <Col className="type" span={12}>
            <FormItem field="filter" label="分类">
              <TemplateTypeSelect size="small" />
            </FormItem>
          </Col>
          <Col className="type" span={12}>
            <FormItem field="order" label="排序">
              <TemplateOrderSelect size="small" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <h4 className={styles.section_title}>模板列表</h4>
      <Spin style={{ display: 'block' }} loading={loading}>
        <div className={styles.resources_list}>
          {resourceListRes.resourceList.map(
            ({ thumbnailUrl, title, resourceId }) => (
              <Card
                hoverable
                cover={
                  <div className={styles.template_cover}>
                    <CustomImage
                      src={thumbnailUrl}
                      height={80}
                      width="100%"
                      preview={false}
                      className={styles.resource_cover}
                    />
                    <div className={styles.template_btns}>
                      <Link
                        className={styles.action_btn}
                        target="_blank"
                        to={generatePagePath({
                          resource_id: resourceId,
                          resource_type: 'template',
                        })}
                      >
                        <Button
                          className={styles.template_btn}
                          size="mini"
                          icon={<IconEye />}
                        >
                          查看
                        </Button>
                      </Link>
                      <Button
                        className={styles.template_btn}
                        size="mini"
                        type="primary"
                        icon={<IconPlus />}
                        onClick={generateImportHandler(resourceId)}
                      >
                        引入
                      </Button>
                    </div>
                  </div>
                }
                className={styles.resource_card}
                key={resourceId}
              >
                {title}
              </Card>
            )
          )}
        </div>
        {resourceListRes.resourceList.length === 0 && <Empty />}
        <Divider
          className={clsx(styles.load_trigger, 'load_trigger')}
          ref={triggerElementRef}
        >
          <span className="tip_text">底线在这里</span>
        </Divider>
      </Spin>
    </div>
  )
}

export default TemplatePane
