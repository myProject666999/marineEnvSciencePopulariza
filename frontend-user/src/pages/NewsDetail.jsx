import { Typography, Space, Tag, Button } from 'antd'
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title, Text } = Typography

function NewsDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNewsDetail()
  }, [id])

  const fetchNewsDetail = async () => {
    try {
      const res = await request.get(`/content/news/${id}`)
      setNews(res.data)
    } catch (error) {
      console.error('获取新闻详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}>加载中...</div>
  }

  if (!news) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Text type="secondary">新闻不存在</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/news')}>
            返回列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-container">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/news')}
        style={{ marginBottom: 24 }}
      >
        返回列表
      </Button>

      <Title level={2} className="detail-title">
        {news.title}
      </Title>

      <div className="detail-meta">
        <Space wrap>
          {news.author && <Text type="secondary">作者: {news.author}</Text>}
          {news.category && <Tag color="blue">{news.category}</Tag>}
          <Text type="secondary">
            <EyeOutlined /> 阅读: {news.view_count || 0}
          </Text>
          {news.created_at && (
            <Text type="secondary">
              发布时间: {new Date(news.created_at).toLocaleString()}
            </Text>
          )}
        </Space>
      </div>

      {news.cover_image && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={news.cover_image}
            alt={news.title}
            style={{
              maxWidth: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
        </div>
      )}

      <div className="detail-content" dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  )
}

export default NewsDetail
