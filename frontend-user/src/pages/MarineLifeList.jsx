import { Row, Col, Card, Typography, message, Pagination } from 'antd'
import { EnvironmentOutlined, EyeOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'

const { Title, Text } = Typography

function MarineLifeList() {
  const [marineLife, setMarineLife] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMarineLife()
  }, [currentPage])

  const fetchMarineLife = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/content/marine-life?page=${currentPage}&page_size=8`)
      setMarineLife(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取海洋生物列表失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <EnvironmentOutlined className="page-icon" />
        <Title level={2} className="page-title">
          海洋生物科普
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {marineLife.map((life) => (
          <Col xs={24} sm={12} md={8} lg={6} key={life.id}>
            <Card
              hoverable
              className="content-card"
              cover={
                <div className="card-cover">
                  {life.cover_image ? (
                    <img src={life.cover_image} alt={life.title} />
                  ) : (
                    <EnvironmentOutlined className="card-placeholder-icon" />
                  )}
                </div>
              }
              onClick={() => navigate(`/marine-life/${life.id}`)}
            >
              <Card.Meta
                title={<div className="card-title">{life.title}</div>}
                description={
                  <div className="card-meta">
                    <div className="view-count">
                      <EyeOutlined /> 浏览量: {life.view_count}
                    </div>
                    <Text type="secondary" className="card-date">
                      {new Date(life.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {total > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            pageSize={8}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      {marineLife.length === 0 && !loading && (
        <div className="empty-state">
          <EnvironmentOutlined className="empty-icon" />
          <p>暂无海洋生物科普内容</p>
        </div>
      )}
    </div>
  )
}

export default MarineLifeList
