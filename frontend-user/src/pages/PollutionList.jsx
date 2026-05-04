import { Row, Col, Card, Typography, message, Pagination } from 'antd'
import { WarningOutlined, EyeOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'

const { Title, Text } = Typography

function PollutionList() {
  const [pollutions, setPollutions] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPollutions()
  }, [currentPage])

  const fetchPollutions = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/content/pollution?page=${currentPage}&page_size=8`)
      setPollutions(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取污染治理列表失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <WarningOutlined className="page-icon" />
        <Title level={2} className="page-title">
          海洋污染与治理
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {pollutions.map((pollution) => (
          <Col xs={24} sm={12} md={8} lg={6} key={pollution.id}>
            <Card
              hoverable
              className="content-card"
              cover={
                <div className="card-cover">
                  {pollution.cover_image ? (
                    <img src={pollution.cover_image} alt={pollution.title} />
                  ) : (
                    <WarningOutlined className="card-placeholder-icon" />
                  )}
                </div>
              }
              onClick={() => navigate(`/pollution-control/${pollution.id}`)}
            >
              <Card.Meta
                title={<div className="card-title">{pollution.title}</div>}
                description={
                  <div className="card-meta">
                    <div className="view-count">
                      <EyeOutlined /> 浏览量: {pollution.view_count}
                    </div>
                    <Text type="secondary" className="card-date">
                      {new Date(pollution.created_at).toLocaleDateString()}
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

      {pollutions.length === 0 && !loading && (
        <div className="empty-state">
          <WarningOutlined className="empty-icon" />
          <p>暂无污染治理内容</p>
        </div>
      )}
    </div>
  )
}

export default PollutionList
