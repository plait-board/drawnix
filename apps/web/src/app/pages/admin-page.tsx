import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Menu, 
  Card, 
  Table, 
  Button, 
  Switch, 
  Typography, 
  Space, 
  Select, 
  Tag, 
  Avatar, 
  Divider, 
  ConfigProvider
} from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  LogoutOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  DeleteOutlined, 
  EditOutlined 
} from '@ant-design/icons';
import { MockAuthService, MockStorageService, BoardData, User } from '../services/mock-service';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// 布局类型
const LayoutMode = {
  LIST: 'list',
  CARD: 'card'
} as const;

export const AdminPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [layoutMode, setLayoutMode] = useState<'list' | 'card'>(LayoutMode.LIST);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 检查认证
  useEffect(() => {
    const user = MockAuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    loadData();
  }, [navigate]);

  // 加载数据
  const loadData = () => {
    // 加载用户数据
    const usersJson = localStorage.getItem('drawnix_users');
    const usersData = usersJson ? JSON.parse(usersJson) : [
      { id: 'user-a', username: '123', password: '123', role: 'user' },
      { id: 'user-b', username: 'userb', password: 'password123', role: 'user' },
    ];
    setUsers(usersData);

    // 加载黑板数据
    const boardsData = MockStorageService.getBoards();
    setBoards(boardsData);
  };

  // 用户列表列定义
  const userColumns = [
    {
      title: 'Avatar',
      dataIndex: 'username',
      key: 'avatar',
      render: (text: string) => {
        return (
          <Avatar size="large" style={{ backgroundColor: '#667eea' }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
        );
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => {
        return <Text strong>{text}</Text>;
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        return (
          <Tag color={role === 'admin' ? 'green' : 'blue'}>
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User) => {
        return (
          <Space size="middle">
            <Button type="text" size="small" icon={<EditOutlined />}>
              Edit
            </Button>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  // 黑板列表列定义
  const boardColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => {
        return <Text strong>{text}</Text>;
      },
    },
    {
      title: 'Owner',
      dataIndex: 'ownerId',
      key: 'owner',
      render: (ownerId: string) => {
        return <Text>{ownerId.substring(0, 8)}...</Text>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        return (
          <Tag color={status === 'published' ? 'green' : 'orange'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (time: number) => {
        return (
          <Text type="secondary">
            {new Date(time).toLocaleDateString()}
          </Text>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: BoardData) => {
        return (
          <Space size="middle">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/board/${record.id}`)}
            >
              View
            </Button>
            <Button type="text" size="small" icon={<EditOutlined />}>
              Edit
            </Button>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  // 格式化日期
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 登出
  const handleLogout = () => {
    MockAuthService.logout();
    navigate('/login');
  };

  // 切换布局模式
  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === LayoutMode.LIST ? LayoutMode.CARD : LayoutMode.LIST);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        {/* 侧边栏 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            background: '#ffffff',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
            borderRight: '1px solid #f0f2f5',
          }}
        >
          <div style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid #f0f2f5',
            fontWeight: 600,
            color: '#667eea',
            fontSize: 18
          }}>
            Admin
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['users']}
            selectedKeys={[activeMenu]}
            style={{ 
              borderRight: 0, 
              background: '#ffffff',
              marginTop: 0,
            }}
            onSelect={(e) => setActiveMenu(e.key)}
            items={[
              {
                key: 'users',
                icon: <UserOutlined />,
                label: '用户管理',
              },
              {
                key: 'boards',
                icon: <FileTextOutlined />,
                label: '黑板管理',
              },
            ]}
          />
        </Sider>

        <Layout>
          {/* 顶部导航 */}
          <Header style={{ 
            background: '#ffffff', 
            padding: 0,
            paddingLeft: 24,
            paddingRight: 24,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderBottom: '1px solid #f0f2f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#2d3748', fontWeight: 600 }}>
                {activeMenu === 'users' ? '用户管理' : '黑板管理'}
              </Title>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar size="small" style={{ backgroundColor: '#667eea' }}>
                  {currentUser?.username.charAt(0).toUpperCase()}
                </Avatar>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {currentUser?.username}
                </Text>
              </div>
              <Divider type="vertical" style={{ margin: 0 }} />
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                size="small"
                danger
              >
                Logout
              </Button>
            </div>
          </Header>

          {/* 主内容区域 */}
          <Content style={{ padding: 24, background: '#f5f7fa' }}>
            {/* 控制面板 */}
            {activeMenu === 'boards' && (
              <Card 
                style={{ 
                  marginBottom: 24,
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #f0f2f5',
                  borderRadius: 12,
                }}
                styles={{ body: { padding: 16 } }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Layout Mode:
                    </Text>
                    <Button 
                      type={layoutMode === LayoutMode.LIST ? 'primary' : 'default'}
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={() => setLayoutMode(LayoutMode.LIST)}
                    >
                      List
                    </Button>
                    <Button 
                      type={layoutMode === LayoutMode.CARD ? 'primary' : 'default'}
                      size="small"
                      icon={<DashboardOutlined />}
                      onClick={() => setLayoutMode(LayoutMode.CARD)}
                    >
                      Card
                    </Button>
                  </Space>
                </div>
              </Card>
            )}

            {/* 用户管理 */}
            {activeMenu === 'users' && (
              <Card 
                style={{ 
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #f0f2f5',
                  borderRadius: 12,
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ marginBottom: 24 }}>
                  <Title level={5} style={{ margin: 0, color: '#4a5568', fontWeight: 600 }}>
                    Total Users: {users.length}
                  </Title>
                </div>

                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total) => `Total ${total} items`,
                  }}
                  size="middle"
                  style={{ borderRadius: 8, overflow: 'hidden' }}
                />
              </Card>
            )}

            {/* 黑板管理 */}
            {activeMenu === 'boards' && (
              <div>
                <Card 
                  style={{ 
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f0f2f5',
                    borderRadius: 12,
                    marginBottom: 24,
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ margin: 0, color: '#4a5568', fontWeight: 600 }}>
                      Total Boards: {boards.length}
                    </Title>
                  </div>

                  {/* 列表模式 */}
                  {layoutMode === LayoutMode.LIST ? (
                    <Table
                      columns={boardColumns}
                      dataSource={boards}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total) => `Total ${total} items`,
                      }}
                      size="middle"
                      style={{ borderRadius: 8, overflow: 'hidden' }}
                    />
                  ) : (
                    /* 卡片模式 */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                      {boards.map((board) => (
                        <Card
                          key={board.id}
                          style={{
                            background: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f0f2f5',
                            borderRadius: 12,
                            transition: 'all 0.3s ease',
                          }}
                          hoverable
                          bodyStyle={{ padding: 20 }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                          }}
                        >
                          <div style={{ marginBottom: 16 }}>
                            <Tag 
                              color={board.status === 'published' ? 'green' : 'orange'}
                              style={{ marginBottom: 8 }}
                            >
                              {board.status.toUpperCase()}
                            </Tag>
                            <Title level={5} style={{ margin: 0, color: '#2d3748', fontWeight: 600 }}>
                              {board.title}
                            </Title>
                          </div>

                          <div style={{ marginBottom: 16 }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Owner ID:
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                                  {board.ownerId.substring(0, 8)}...
                                </Text>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Last Modified:
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                                  {formatDate(board.lastModified).split(',')[0]}
                                </Text>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  Elements Count:
                                </Text>
                                <Text style={{ fontSize: 14, fontWeight: 500 }}>
                                  {board.elements.length}
                                </Text>
                              </div>
                            </Space>
                          </div>

                          <Divider orientation="horizontal" style={{ margin: '16px 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <Button 
                              type="primary" 
                              size="small" 
                              icon={<EyeOutlined />}
                              onClick={() => navigate(`/board/${board.id}`)}
                              style={{ borderRadius: 6 }}
                            >
                              View
                            </Button>
                            <Button 
                              type="default" 
                              size="small" 
                              icon={<EditOutlined />}
                              style={{ borderRadius: 6 }}
                            >
                              Edit
                            </Button>
                            <Button 
                              type="text" 
                              size="small" 
                              danger 
                              icon={<DeleteOutlined />}
                              style={{ borderRadius: 6 }}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};