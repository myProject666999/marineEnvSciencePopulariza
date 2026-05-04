import { Card, Typography, Button, Table, Tag, Modal, Form, Input, Select, DatePicker, TimePicker, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import request from '../utils/request'

const { Title, Text } = Typography
const { TextArea } = Input
const { RangePicker } = TimePicker

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentReservation, setCurrentReservation] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchReservations()
    fetchSeats()
  }, [currentPage])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/user/reservations?page=${currentPage}&page_size=10`)
      setReservations(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取预约列表失败:', error)
      message.error('获取数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const fetchSeats = async () => {
    try {
      const res = await request.get('/content/seats?page=1&page_size=100')
      const availableSeats = (res.data.list || []).filter((s) => s.status === 'available')
      setSeats(availableSeats)
    } catch (error) {
      console.error('获取座位列表失败:', error)
    }
  }

  const handleCreate = () => {
    setEditMode(false)
    setCurrentReservation(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleCancel = async (id) => {
    try {
      await request.post(`/user/reservations/${id}/cancel`)
      message.success('预约已取消')
      fetchReservations()
    } catch (error) {
      console.error('取消预约失败:', error)
      message.error('取消失败，请稍后重试')
    }
  }

  const handleSubmit = async (values) => {
    const { reservation_date, time_range, ...restValues } = values
    const formattedValues = {
      ...restValues,
      reservation_date: reservation_date.format('YYYY-MM-DD'),
      start_time: time_range[0].format('HH:mm'),
      end_time: time_range[1].format('HH:mm'),
    }

    try {
      if (editMode && currentReservation) {
        // 后端没有更新预约的API
        message.info('预约更新功能暂未开放')
        setModalVisible(false)
      } else {
        await request.post('/user/reservations', formattedValues)
        message.success('预约已创建')
      }
      setModalVisible(false)
      form.resetFields()
      fetchReservations()
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败，请稍后重试')
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
      title: '座位',
      dataIndex: ['seat', 'seat_number'],
      key: 'seat',
    },
    {
      title: '区域',
      dataIndex: ['seat', 'area'],
      key: 'area',
    },
    {
      title: '日期',
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
      title: '签到',
      dataIndex: 'is_signed_in',
      key: 'is_signed_in',
      render: (signedIn) => (
        <span className={`status-tag ${signedIn ? 'active' : 'disabled'}`}>
          {signedIn ? '已签到' : '未签到'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const canCancel = ['pending', 'approved'].includes(record.status)
        return (
          <Space>
            {canCancel && (
              <Popconfirm
                title="确认取消该预约？"
                onConfirm={() => handleCancel(record.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button type="link" danger>
                  取消预约
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <CalendarOutlined className="page-icon" />
          <Title level={2} className="page-title" style={{ margin: 0 }}>
            预约管理
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建预约
        </Button>
      </div>

      <Card>
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
      </Card>

      {reservations.length === 0 && !loading && (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <CalendarOutlined className="empty-icon" />
          <p>暂无预约记录</p>
          <Button type="primary" onClick={handleCreate} style={{ marginTop: 16 }}>
            立即预约
          </Button>
        </div>
      )}

      <Modal
        title={editMode ? '编辑预约' : '新建预约'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="seat_id"
            label="选择座位"
            rules={[{ required: true, message: '请选择座位!' }]}
          >
            <Select
              size="large"
              placeholder="请选择座位"
              style={{ width: '100%' }}
            >
              {seats.map((seat) => (
                <Select.Option key={seat.id} value={seat.id}>
                  {seat.seat_number} ({seat.area || '默认区域'})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reservation_date"
            label="预约日期"
            rules={[{ required: true, message: '请选择日期!' }]}
          >
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              placeholder="请选择预约日期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="time_range"
            label="预约时间"
            rules={[{ required: true, message: '请选择时间!' }]}
          >
            <RangePicker
              size="large"
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
              format="HH:mm"
              minuteStep={30}
            />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="预约用途"
            rules={[
              { required: true, message: '请输入预约用途!' },
              { max: 500, message: '用途描述不能超过500个字符' },
            ]}
          >
            <TextArea
              placeholder="请输入预约用途"
              rows={3}
              size="large"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {editMode ? '保存' : '提交预约'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Reservations
