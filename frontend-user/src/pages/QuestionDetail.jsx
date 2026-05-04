import { Card, Typography, Divider, Tag, Button, Space, message, Spin, List, Avatar, Form, Input, Popconfirm } from 'antd'
import { ArrowLeftOutlined, QuestionCircleOutlined, EyeOutlined, MessageOutlined, LikeOutlined, LikeFilled, CheckCircleOutlined, UserOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import request from '../utils/request'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

function QuestionDetail() {
  const [question, setQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [answerForm] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchQuestionDetail()
    fetchAnswers()
  }, [id])

  const fetchQuestionDetail = async () => {
    try {
      const res = await request.get(`/content/questions/${id}`)
      setQuestion(res.data.question)
      setAnswers(res.data.answers || [])
    } catch (error) {
      console.error('获取问题详情失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnswers = async () => {
    // 答案已经在 fetchQuestionDetail 中获取
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

  const handleSubmitAnswer = async (values) => {
    setSubmitting(true)
    try {
      await request.post(`/user/questions/${id}/answers`, values)
      message.success('回答发布成功')
      answerForm.resetFields()
      fetchQuestionDetail()
    } catch (error) {
      console.error('发布回答失败:', error)
      message.error('发布失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeAnswer = async (answerId) => {
    try {
      await request.post(`/user/answers/${answerId}/like`)
      message.success('点赞成功')
      fetchQuestionDetail()
    } catch (error) {
      console.error('点赞失败:', error)
      message.error('点赞失败，请稍后重试')
    }
  }

  const handleAdoptAnswer = async (answerId) => {
    try {
      await request.put(`/user/answers/${answerId}/accept`)
      message.success('已采纳该回答')
      fetchQuestionDetail()
    } catch (error) {
      console.error('采纳失败:', error)
      message.error('采纳失败，请稍后重试')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="content-wrapper">
        <div className="empty-state">
          <QuestionCircleOutlined className="empty-icon" />
          <p>问题不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="content-wrapper">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, padding: 0 }}
      >
        返回列表
      </Button>

      <Card className="detail-card" style={{ marginBottom: 24 }}>
        <div className="qa-detail-header">
          <div className="qa-user-info">
            <div className="qa-avatar-large">
              <UserOutlined />
            </div>
            <div>
              <div className="qa-username-large">{question.user?.username || '匿名用户'}</div>
              <Text type="secondary" className="qa-date">
                发布于 {new Date(question.created_at).toLocaleString()}
              </Text>
            </div>
          </div>
          {getStatusTag(question.status)}
        </div>

        <Title level={2} className="detail-title" style={{ marginTop: 16 }}>
          {question.title}
        </Title>

        <div className="detail-meta" style={{ marginBottom: 16 }}>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary">
              <EyeOutlined /> 浏览 {question.view_count || 0}
            </Text>
            <Text type="secondary">
              <MessageOutlined /> 回答 {question.answer_count || 0}
            </Text>
            {question.category && (
              <Tag color="blue">{question.category}</Tag>
            )}
          </Space>
        </div>

        {question.tags && (
          <div className="detail-tags" style={{ marginBottom: 16 }}>
            {question.tags.split(',').map((tag, index) => (
              <Tag key={index} size="small">{tag.trim()}</Tag>
            ))}
          </div>
        )}

        <Divider />

        <div className="detail-content">
          <Paragraph>
            {question.content}
          </Paragraph>
        </div>
      </Card>

      <Card className="detail-card">
        <Title level={3} style={{ marginBottom: 24 }}>
          <MessageOutlined /> 回答 ({answers.length})
        </Title>

        <Form
          form={answerForm}
          layout="vertical"
          onFinish={handleSubmitAnswer}
          style={{ marginBottom: 32 }}
        >
          <Form.Item
            name="content"
            rules={[
              { required: true, message: '请输入回答内容!' },
              { min: 5, message: '回答内容至少5个字符' },
            ]}
          >
            <TextArea
              placeholder="请输入你的回答，帮助提问者解决问题..."
              rows={4}
              size="large"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
            >
              发布回答
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        {answers.length > 0 ? (
          <List
            dataSource={answers}
            renderItem={(answer) => (
              <List.Item
                key={answer.id}
                style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar size="large" icon={<UserOutlined />} />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="qa-username">{answer.user?.username || '匿名用户'}</span>
                        <Text type="secondary" style={{ marginLeft: 12 }}>
                          {new Date(answer.created_at).toLocaleString()}
                        </Text>
                      </div>
                      {answer.is_accepted && (
                        <Tag icon={<CheckCircleOutlined />} color="green">
                          已采纳
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph style={{ marginTop: 12, marginBottom: 12 }}>
                        {answer.content}
                      </Paragraph>
                      <Space>
                        <Button
                          type="text"
                          icon={answer.liked ? <LikeFilled /> : <LikeOutlined />}
                          onClick={() => handleLikeAnswer(answer.id)}
                          style={{ color: answer.liked ? '#1890ff' : 'inherit' }}
                        >
                          {answer.like_count || 0}
                        </Button>
                        {!answer.is_accepted && question.status !== 'resolved' && (
                          <Popconfirm
                            title="确认采纳该回答？"
                            onConfirm={() => handleAdoptAnswer(answer.id)}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button
                              type="text"
                              icon={<CheckCircleOutlined />}
                              style={{ color: '#52c41a' }}
                            >
                              采纳
                            </Button>
                          </Popconfirm>
                        )}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="empty-state" style={{ padding: 40 }}>
            <MessageOutlined className="empty-icon" />
            <p>暂无回答，快来发表第一个回答吧！</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default QuestionDetail
