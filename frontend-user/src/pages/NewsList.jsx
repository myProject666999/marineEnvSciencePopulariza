import { Row, Col, Card, Typography, Space, Tag, Pagination } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title, Text } = Typography

function NewsList() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [currentPage])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/content/news?page=${currentPage}&page_size=12`)
      setNews(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取新闻列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        新闻资讯
      </Title>
      
      <Row gutter={[24, 24]}>
        {news.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <Card
              hoverable
              loading={loading}
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
                  <Space direction="vertical" size={8}>
                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333', lineHeight: 1.4 }}>
                      {item.title}
                    </div>
                    <Space wrap>
                      {item.category && <Tag color="blue">{item.category}</Tag>}
                      {item.author && <Text type="secondary">作者: {item.author}</Text>}
                    </Space>
                    <Space>
                      <Text type="secondary">阅读: {item.view_count || 0}</Text>
                      {item.is_top && <Tag color="gold">置顶</Tag>}
                    </Space>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={12}
            onChange={(page) => setCurrentPage(page)}
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      )}
    </div>
  )
}

export default NewsList
