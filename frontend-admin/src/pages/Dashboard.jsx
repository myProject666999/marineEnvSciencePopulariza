import { Row, Col, Card, Typography } from 'antd'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title } = Typography

function Dashboard() {
  const [userStats, setUserStats] = useState(null)
  const [reservationStats, setReservationStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const [userRes, reservationRes] = await Promise.all([
        request.get('/admin/statistics/users'),
        request.get('/admin/statistics/reservations')
      ])
      setUserStats(userRes.data)
      setReservationStats(reservationRes.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const userStatsCards = [
    {
      title: '总用户数',
      value: userStats?.total_users || 0,
      color: 'blue',
      icon: '👥'
    },
    {
      title: '活跃用户',
      value: userStats?.active_users || 0,
      color: 'green',
      icon: '✅'
    },
    {
      title: '今日新增',
      value: userStats?.today_new_users || 0,
      color: 'orange',
      icon: '📈'
    },
  ]

  const reservationStatsCards = [
    {
      title: '总预约数',
      value: reservationStats?.total_reservations || 0,
      color: 'purple',
      icon: '📅'
    },
    {
      title: '待处理预约',
      value: reservationStats?.pending_reservations || 0,
      color: 'orange',
      icon: '⏳'
    },
    {
      title: '已完成预约',
      value: reservationStats?.completed_reservations || 0,
      color: 'green',
      icon: '✅'
    },
    {
      title: '今日预约',
      value: reservationStats?.today_reservations || 0,
      color: 'blue',
      icon: '📋'
    },
  ]

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        数据统计
      </Title>

      <Title level={4} style={{ marginBottom: 16 }}>
        用户统计
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {userStatsCards.map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <div className={`stats-card ${stat.color}`}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{stat.icon}</div>
              <div className="stats-number">{stat.value}</div>
              <div className="stats-label">{stat.title}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Title level={4} style={{ marginBottom: 16 }}>
        预约统计
      </Title>
      <Row gutter={[24, 24]}>
        {reservationStatsCards.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <div className={`stats-card ${stat.color}`}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{stat.icon}</div>
              <div className="stats-number">{stat.value}</div>
              <div className="stats-label">{stat.title}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Dashboard
