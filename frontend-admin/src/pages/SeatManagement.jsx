import { Table, Button, Space, Typography, Tag, Popconfirm, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import request from '../utils/request'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

function SeatManagement() {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentSeat, setCurrentSeat] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchSeats()
  }, [currentPage])

  const fetchSeats = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/admin/seats?page=${currentPage}&page_size=10`)
      setSeats(res.data.list)
      setTotal(res.data.total)
    } catch (error) {
      console.error('获取座位列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditMode(false)
    setCurrentSeat(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditMode(true)
    setCurrentSeat(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await request.delete(`/admin/seats/${id}`)
      message.success('座位已删除')
      fetchSeats()
    } catch (error) {
      console.error('删除座位失败:', error)
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editMode && currentSeat) {
        await request.put(`/admin/seats/${currentSeat.id}`, values)
        message.success('座位已更新')
      } else {
        await request.post('/admin/seats', values)
        message.success('座位已创建')
      }
      setModalVisible(false)
      form.resetFields()
      fetchSeats()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  const getStatusTag = (status) => {
    return (
      <span className={`status-tag ${status === 'available' ? 'active' : 'disabled'}`}>
        {status === 'available' ? '可用' : '不可用'}
      </span>
    )
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '座位号',
      dataIndex: 'seat_number',
      key: 'seat_number',
    },
    {
      title: '区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该座位？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          座位管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          添加座位
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={seats}
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

      <Modal
        title={editMode ? '编辑座位' : '添加座位'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="seat_number"
            label="座位号"
            rules={[{ required: true, message: '请输入座位号!' }]}
          >
            <Input placeholder="请输入座位号" size="large" />
          </Form.Item>

          <Form.Item
            name="area"
            label="区域"
            rules={[{ max: 50, message: '区域名称不能超过50个字符' }]}
          >
            <Input placeholder="请输入区域" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <TextArea placeholder="请输入描述" rows={3} size="large" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue="available"
          >
            <Select size="large" style={{ width: '100%' }}>
              <Option value="available">可用</Option>
              <Option value="unavailable">不可用</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {editMode ? '保存' : '创建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SeatManagement
