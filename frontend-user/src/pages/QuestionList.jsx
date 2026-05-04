import { Row, Col, Card, Typography, Button, Tag, message, Pagination, Modal, Form, Input, Select } from 'antd'
import { QuestionCircleOutlined, EyeOutlined, PlusOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

function QuestionList() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    fetchQuestions()
  }, [currentPage])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/content/questions?page=${currentPage}&page_size=10`)
      setQuestions(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取问题列表失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuestion = async (values) => {
    try {
      await request.post('/user/questions', values)
      message.success('问题发布成功')
      setModalVisible(false)
      form.resetFields()
      fetchQuestions()
    } catch (error) {
      console.error('发布问题失败:', error)
      message.error('发布失败，请稍后重试')
    }
  }

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { text: '待回答', color: 'orange' },
      answered: { text: '已回答', color: 'blue' },
      resolved: { text: '已解决', color: 'green' },
    }
    const info = statusMap[status] || { text: status, color: 'default' }
    return <Tag color={info.color}>{info.text}</Tag>
  }

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <QuestionCircleOutlined className="page-icon" />
          <Title level={2} className="page-title" style={{ margin: 0 }}>
            互动问答
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          发布问题
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {questions.map((question) => (
          <Col xs={24} key={question.id}>
            <Card
              hoverable
              className="qa-card"
              onClick={() => navigate(`/questions/${question.id}`)}
            >
              <div className="qa-card-header">
                <div className="qa-user-info">
                  <div className="qa-avatar">
                    <UserOutlined />
                  </div>
                  <div>
                    <div className="qa-username">{question.user?.username || '匿名用户'}</div>
                    <Text type="secondary" className="qa-date">
                      {new Date(question.created_at).toLocaleString()}
                    </Text>
                  </div>
                </div>
                {getStatusTag(question.status)}
              </div>

              <div className="qa-card-title">{question.title}</div>

              <Paragraph className="qa-card-content" ellipsis={{ rows: 2 }}>
                {question.content}
              </Paragraph>

              <div className="qa-card-footer">
                <div className="qa-stats">
                  <span className="qa-stat">
                    <MessageOutlined /> 回答数: {question.answer_count || 0}
                  </span>
                  <span className="qa-stat">
                    <EyeOutlined /> 浏览量: {question.view_count || 0}
                  </span>
                  {question.tags && question.tags.split(',').map((tag, index) => (
                    <Tag key={index} size="small">{tag.trim()}</Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {total > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      {questions.length === 0 && !loading && (
        <div className="empty-state">
          <QuestionCircleOutlined className="empty-icon" />
          <p>暂无问题，快来发布第一个问题吧！</p>
        </div>
      )}

      <Modal
        title="发布问题"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuestion}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="title"
            label="问题标题"
            rules={[
              { required: true, message: '请输入问题标题!' },
              { min: 5, max: 200, message: '标题长度应在5-200个字符之间' },
            ]}
          >
            <Input placeholder="请输入问题标题，简要描述你的问题" size="large" />
          </Form.Item>

          <Form.Item
            name="category"
            label="问题分类"
            rules={[{ max: 50, message: '分类名称不能超过50个字符' }]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="请输入或选择分类（如：海洋生物、环境污染、气候变化等）"
              style={{ width: '100%' }}
              options={[
                { value: '海洋生物', label: '海洋生物' },
                { value: '环境污染', label: '环境污染' },
                { value: '气候变化', label: '气候变化' },
                { value: '政策法规', label: '政策法规' },
                { value: '科普知识', label: '科普知识' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
            rules={[{ max: 200, message: '标签不能超过200个字符' }]}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="请输入标签，多个标签用逗号分隔"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="问题详情"
            rules={[
              { required: true, message: '请输入问题详情!' },
              { min: 10, message: '问题详情至少10个字符' },
            ]}
          >
            <TextArea
              placeholder="请详细描述你的问题，以便其他用户能够更好地帮助你..."
              rows={6}
              size="large"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              发布问题
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default QuestionList
