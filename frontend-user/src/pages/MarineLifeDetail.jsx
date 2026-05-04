import { Card, Typography, Divider, Tag, Button, Space, message, Spin } from 'antd'
import { ArrowLeftOutlined, EnvironmentOutlined, EyeOutlined, TagsOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import request from '../utils/request'

const { Title, Text, Paragraph } = Typography

function MarineLifeDetail() {
  const [marineLife, setMarineLife] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchMarineLifeDetail()
  }, [id])

  const fetchMarineLifeDetail = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/content/marine-life/${id}`)
      setMarineLife(res.data)
    } catch (error) {
      console.error('获取海洋生物详情失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const renderTags = (tags) => {
    if (!tags) return null
    const tagList = tags.split(',').map((t) => t.trim()).filter((t) => t)
    if (tagList.length === 0) return null
    return (
      <Space wrap>
        <TagsOutlined />
        {tagList.map((tag, index) => (
          <Tag key={index} color="green">
            {tag}
          </Tag>
        ))}
      </Space>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!marineLife) {
    return (
      <div className="content-wrapper">
        <div className="empty-state">
          <EnvironmentOutlined className="empty-icon" />
          <p>内容不存在</p>
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

      <Card className="detail-card">
        <div className="detail-header">
          {marineLife.cover_image && (
            <div className="detail-cover">
              <img src={marineLife.cover_image} alt={marineLife.title} />
            </div>
          )}

          <Title level={2} className="detail-title">
            {marineLife.title}
          </Title>

          <div className="detail-meta">
            <Space split={<Divider type="vertical" />}>
              <Text type="secondary">
                发布于 {new Date(marineLife.created_at).toLocaleDateString()}
              </Text>
              <Text type="secondary">
                <EyeOutlined /> 浏览 {marineLife.view_count}
              </Text>
              {marineLife.category && (
                <Tag color="blue">{marineLife.category}</Tag>
              )}
            </Space>
          </div>

          {marineLife.tags && (
            <div className="detail-tags">
              {renderTags(marineLife.tags)}
            </div>
          )}

          <Divider />

          <div className="detail-content">
            <Paragraph>
              {marineLife.content}
            </Paragraph>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MarineLifeDetail
