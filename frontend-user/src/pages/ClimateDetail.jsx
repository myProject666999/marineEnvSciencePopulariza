import { Typography, Space, Tag, Button } from 'antd'
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title, Text } = Typography

function ClimateDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetail()
  }, [id])

  const fetchDetail = async () => {
    try {
      const res = await request.get(`/content/climate/${id}`)
      setItem(res.data)
    } catch (error) {
      console.error('获取详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}>加载中...</div>
  }

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Text type="secondary">内容不存在</Text>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => navigate('/climate')}>
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
        onClick={() => navigate('/climate')}
        style={{ marginBottom: 24 }}
      >
        返回列表
      </Button>

      <Title level={2} className="detail-title">
        {item.title}
      </Title>

      <div className="detail-meta">
        <Space wrap>
          {item.category && <Tag color="green">{item.category}</Tag>}
          <Text type="secondary">
            <EyeOutlined /> 阅读: {item.view_count || 0}
          </Text>
          {item.created_at && (
            <Text type="secondary">
              发布时间: {new Date(item.created_at).toLocaleString()}
            </Text>
          )}
        </Space>
      </div>

      {item.cover_image && (
        <div style={{ marginBottom: 24 }}>
          <img
            src={item.cover_image}
            alt={item.title}
            style={{
              maxWidth: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
        </div>
      )}

      <div className="detail-content" dangerouslySetInnerHTML={{ __html: item.content }} />
    </div>
  )
}

export default ClimateDetail
