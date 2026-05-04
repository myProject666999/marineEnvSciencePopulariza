import { Card, Form, Input, Button, Avatar, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import request from '../utils/request'

function Profile() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const res = await request.get('/user/profile')
      setUser(res.data)
      form.setFieldsValue({
        nickname: res.data.nickname,
        phone: res.data.phone,
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await request.put('/user/profile', values)
      message.success('更新成功')
      fetchUserProfile()
    } catch (error) {
      console.error('更新失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <Card title="个人信息">
        <div className="user-info-card">
          <Avatar size={80} icon={<UserOutlined />} className="user-avatar" />
          <div style={{ marginTop: 16 }}>
            <h3>{user?.nickname || user?.username}</h3>
            <p style={{ color: '#666' }}>用户名: {user?.username}</p>
            <p style={{ color: '#666' }}>邮箱: {user?.email}</p>
          </div>
        </div>

        <Form
          form={form}
          name="profile"
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ max: 50, message: '昵称不能超过50个字符' }]}
          >
            <Input placeholder="请输入昵称" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ max: 20, message: '手机号不能超过20个字符' }]}
          >
            <Input placeholder="请输入手机号" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" className="btn-primary">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Profile
