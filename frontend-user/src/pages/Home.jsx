import { Row, Col, Card, Typography, Space, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title, Text } = Typography

function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestNews()
  }, [])

  const fetchLatestNews = async () => {
    try {
      const res = await request.get('/content/news')
      setNews(res.data.list.slice(0, 6))
    } catch (error) {
      console.error('获取新闻失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      title: '新闻资讯',
      description: '了解最新的海洋环境动态和保护新闻',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ocean%20news%20marine%20environment%20blue%20sea%20waves&image_size=square',
      path: '/news',
      color: '#1890ff'
    },
    {
      title: '气候变化与海洋影响',
      description: '探索气候变化对海洋生态系统的影响',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=climate%20change%20ocean%20warming%20coral%20reef&image_size=square',
      path: '/climate',
      color: '#52c41a'
    },
    {
      title: '海洋生物科普',
      description: '认识各种神奇的海洋生物',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marine%20life%20fish%20coral%20underwater%20colorful&image_size=square',
      path: '/marine-life',
      color: '#722ed1'
    },
    {
      title: '海洋污染与治理',
      description: '了解海洋污染问题和治理方案',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ocean%20pollution%20plastic%20cleanup%20environmental%20protection&image_size=square',
      path: '/pollution',
      color: '#fa8c16'
    },
    {
      title: '互动问答',
      description: '提问和回答海洋环境相关问题',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=question%20answer%20forum%20discussion%20ocean%20science&image_size=square',
      path: '/questions',
      color: '#eb2f96'
    }
  ]

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1} style={{ color: '#0066cc', marginBottom: 16 }}>
          🌊 海洋环境科普保护平台
        </Title>
        <Text style={{ fontSize: 18, color: '#666' }}>
          保护海洋，守护蔚蓝，从了解开始
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {categories.map((category, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              className="content-card"
              onClick={() => navigate(category.path)}
              cover={
                <div style={{
                  height: 200,
                  background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}aa 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 64
                }}>
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    '🌊'
                  )}
                </div>
              }
            >
              <Card.Meta
                title={category.title}
                description={category.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div>
        <Title level={2} style={{ marginBottom: 24 }}>
          最新资讯
        </Title>
        <Row gutter={[24, 24]}>
          {news.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                className="content-card"
                onClick={() => navigate(`/news/${item.id}`)}
                cover={
                  <img
                    alt={item.title}
                    src={item.cover_image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ocean%20environment%20news%20blue%20sea&image_size=square'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <Space direction="vertical" size={4}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                        {item.title}
                      </div>
                      <Space>
                        {item.category && <Tag color="blue">{item.category}</Tag>}
                        <Text type="secondary">阅读: {item.view_count || 0}</Text>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Home
