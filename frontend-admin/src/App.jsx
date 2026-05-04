import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, message } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  PictureOutlined,
  SettingOutlined,
  NotificationOutlined,
  FileTextOutlined,
  SolutionOutlined,
  LogoutOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import AdminManagement from './pages/AdminManagement'
import ReservationManagement from './pages/ReservationManagement'
import SeatManagement from './pages/SeatManagement'
import request from './utils/request'

const { Header, Sider, Content } = Layout

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const adminStr = localStorage.getItem('admin_user')
    if (token && adminStr) {
      setAdmin(JSON.parse(adminStr))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAdmin(null)
    message.success('退出登录成功')
    navigate('/login')
  }

  const getSelectedKey = () => {
    const path = location.pathname
    if (path === '/' || path === '/dashboard') return 'dashboard'
    if (path.startsWith('/users')) return 'users'
    if (path.startsWith('/admins')) return 'admins'
    if (path.startsWith('/reservations')) return 'reservations'
    if (path.startsWith('/seats')) return 'seats'
    if (path.startsWith('/carousels')) return 'carousels'
    if (path.startsWith('/menus')) return 'menus'
    if (path.startsWith('/announcements')) return 'announcements'
    if (path.startsWith('/logs')) return 'logs'
    if (path.startsWith('/forums')) return 'forums'
    if (path.startsWith('/signin')) return 'signin'
    if (path.startsWith('/cancel-reservation')) return 'cancel-reservation'
    return 'dashboard'
  }

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '数据统计', onClick: () => navigate('/') },
    { key: 'users', icon: <TeamOutlined />, label: '用户管理', onClick: () => navigate('/users') },
    { key: 'admins', icon: <UserOutlined />, label: '管理员管理', onClick: () => navigate('/admins') },
    { key: 'reservations', icon: <CalendarOutlined />, label: '预约管理', onClick: () => navigate('/reservations') },
    { key: 'seats', icon: <AppstoreOutlined />, label: '座位管理', onClick: () => navigate('/seats') },
    { key: 'carousels', icon: <PictureOutlined />, label: '轮播图管理', onClick: () => navigate('/carousels') },
    { key: 'menus', icon: <SettingOutlined />, label: '菜单管理', onClick: () => navigate('/menus') },
    { key: 'announcements', icon: <NotificationOutlined />, label: '公告管理', onClick: () => navigate('/announcements') },
    { key: 'logs', icon: <FileTextOutlined />, label: '操作日志', onClick: () => navigate('/logs') },
    { key: 'forums', icon: <SolutionOutlined />, label: '论坛管理', onClick: () => navigate('/forums') },
    { key: 'signin', icon: <CheckCircleOutlined />, label: '签到管理', onClick: () => navigate('/signin') },
    { key: 'cancel-reservation', icon: <CloseCircleOutlined />, label: '取消预约管理', onClick: () => navigate('/cancel-reservation') },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      danger: true,
    },
  ]

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="admin-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🌊 管理后台
        </div>
        <div>
          {admin && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span>{admin.nickname || admin.username}</span>
              </div>
            </Dropdown>
          )}
        </div>
      </Header>
      <Layout>
        <Sider
          className="admin-sider"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            className="admin-menu"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content className="admin-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admins" element={<AdminManagement />} />
              <Route path="/reservations" element={<ReservationManagement />} />
              <Route path="/seats" element={<SeatManagement />} />
              <Route path="/carousels" element={<div style={{ textAlign: 'center', padding: 48 }}>轮播图管理</div>} />
              <Route path="/menus" element={<div style={{ textAlign: 'center', padding: 48 }}>菜单管理</div>} />
              <Route path="/announcements" element={<div style={{ textAlign: 'center', padding: 48 }}>公告管理</div>} />
              <Route path="/logs" element={<div style={{ textAlign: 'center', padding: 48 }}>操作日志管理</div>} />
              <Route path="/forums" element={<div style={{ textAlign: 'center', padding: 48 }}>论坛管理</div>} />
              <Route path="/signin" element={<div style={{ textAlign: 'center', padding: 48 }}>签到管理</div>} />
              <Route path="/cancel-reservation" element={<div style={{ textAlign: 'center', padding: 48 }}>取消预约管理</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  )
}

export default App
