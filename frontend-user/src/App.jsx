import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, message } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import ClimateList from './pages/ClimateList'
import ClimateDetail from './pages/ClimateDetail'
import MarineLifeList from './pages/MarineLifeList'
import MarineLifeDetail from './pages/MarineLifeDetail'
import PollutionList from './pages/PollutionList'
import PollutionDetail from './pages/PollutionDetail'
import QuestionList from './pages/QuestionList'
import QuestionDetail from './pages/QuestionDetail'
import Profile from './pages/Profile'
import Password from './pages/Password'
import Reservations from './pages/Reservations'
import request from './utils/request'

const { Header, Content, Footer } = Layout

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    message.success('退出登录成功')
    navigate('/')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/user/profile'),
    },
    {
      key: 'password',
      icon: <SettingOutlined />,
      label: '修改密码',
      onClick: () => navigate('/user/password'),
    },
    {
      key: 'reservations',
      icon: <SettingOutlined />,
      label: '我的预约',
      onClick: () => navigate('/user/reservations'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      danger: true,
    },
  ]

  const getSelectedKey = () => {
    const path = location.pathname
    if (path === '/' || path === '/home') return 'home'
    if (path.startsWith('/news')) return 'news'
    if (path.startsWith('/climate')) return 'climate'
    if (path.startsWith('/marine-life')) return 'marine-life'
    if (path.startsWith('/pollution')) return 'pollution'
    if (path.startsWith('/questions')) return 'questions'
    return 'home'
  }

  const menuItems = [
    { key: 'home', label: '首页', onClick: () => navigate('/') },
    { key: 'news', label: '新闻资讯', onClick: () => navigate('/news') },
    { key: 'climate', label: '气候变化', onClick: () => navigate('/climate') },
    { key: 'marine-life', label: '海洋生物', onClick: () => navigate('/marine-life') },
    { key: 'pollution', label: '污染治理', onClick: () => navigate('/pollution') },
    { key: 'questions', label: '互动问答', onClick: () => navigate('/questions') },
  ]

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🌊 海洋环境科普保护平台
        </div>
        <Menu
          className="header-menu"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
        <div className="header-right">
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <span>{user.nickname || user.username}</span>
              </div>
            </Dropdown>
          ) : (
            <>
              <a onClick={() => navigate('/login')}>登录</a>
              <a onClick={() => navigate('/register')}>注册</a>
            </>
          )}
        </div>
      </Header>
      <Content className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/climate" element={<ClimateList />} />
          <Route path="/climate/:id" element={<ClimateDetail />} />
          <Route path="/marine-life" element={<MarineLifeList />} />
          <Route path="/marine-life/:id" element={<MarineLifeDetail />} />
          <Route path="/pollution" element={<PollutionList />} />
          <Route path="/pollution/:id" element={<PollutionDetail />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/password" element={<Password />} />
          <Route path="/user/reservations" element={<Reservations />} />
        </Routes>
      </Content>
      <Footer className="footer">
        海洋环境科普保护平台 ©{new Date().getFullYear()} Created with ❤️
      </Footer>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

export default App
