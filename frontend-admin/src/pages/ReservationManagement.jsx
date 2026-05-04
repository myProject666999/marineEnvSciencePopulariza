import { Table, Button, Space, Typography, Tag, Popconfirm, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title } = Typography

function ReservationManagement() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchReservations()
  }, [currentPage])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/admin/reservations?page=${currentPage}&page_size=10`)
      setReservations(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取预约列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await request.put(`/admin/reservations/${id}/approve`)
      message.success('预约已通过')
      fetchReservations()
    } catch (error) {
      console.error('审核失败:', error)
    }
  }

  const handleReject = async (id) => {
    try {
      await request.put(`/admin/reservations/${id}/reject`)
      message.success('预约已拒绝')
      fetchReservations()
    } catch (error) {
      console.error('拒绝失败:', error)
    }
  }

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { text: '待审核', class: 'pending' },
      approved: { text: '已通过', class: 'approved' },
      rejected: { text: '已拒绝', class: 'rejected' },
      completed: { text: '已完成', class: 'completed' },
      canceled: { text: '已取消', class: 'canceled' },
    }
    const info = statusMap[status] || { text: status, class: '' }
    return <span className={`status-tag ${info.class}`}>{info.text}</span>
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      key: 'user',
    },
    {
      title: '座位',
      dataIndex: ['seat', 'seat_number'],
      key: 'seat',
    },
    {
      title: '预约日期',
      dataIndex: 'reservation_date',
      key: 'reservation_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => `${record.start_time} - ${record.end_time}`,
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '签到状态',
      dataIndex: 'is_signed_in',
      key: 'is_signed_in',
      render: (signedIn) => (
        <span className={`status-tag ${signedIn ? 'active' : 'disabled'}`}>
          {signedIn ? '已签到' : '未签到'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'pending') {
          return (
            <Space size="middle">
              <Popconfirm
                title="确认通过该预约？"
                onConfirm={() => handleApprove(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="link"
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                >
                  通过
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确认拒绝该预约？"
                onConfirm={() => handleReject(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  type="link"
                  icon={<CloseCircleOutlined />}
                  danger
                >
                  拒绝
                </Button>
              </Popconfirm>
            </Space>
          )
        }
        return <span className="status-tag disabled">无需操作</span>
      },
    },
  ]

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        预约管理
      </Title>

      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: total,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  )
}

export default ReservationManagement
