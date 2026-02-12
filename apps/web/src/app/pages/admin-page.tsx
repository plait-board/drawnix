import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Avatar,
  Statistic,
  Popconfirm,
  message,
  Spin,
  Badge,
  ConfigProvider,
  theme,
  Dropdown,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileImageOutlined,
  LogoutOutlined,
  EyeOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CrownOutlined,
  SettingOutlined,
  FileTextOutlined,
  GlobalOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  adminApi,
  getStoredUser,
  removeToken,
  removeStoredUser,
  User,
  Board,
} from '../../api';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export const AdminPage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [users, setUsers] = useState<(User & { board_count: number })[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    boards: 0,
    publishedBoards: 0,
    attachments: 0,
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      message.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    setCurrentUser(user);
    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadStats(), loadUsers(), loadBoards()]);
    } catch (error: any) {
      message.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const response = await adminApi.getStats();
    if (response.success && response.data) {
      setStats(response.data);
    }
  };

  const loadUsers = async () => {
    const response = await adminApi.getUsers();
    if (response.success && response.data) {
      setUsers(response.data.users);
    }
  };

  const loadBoards = async () => {
    const response = await adminApi.getBoards();
    if (response.success && response.data) {
      setBoards(response.data.boards);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const response = await adminApi.deleteBoard(boardId);
      if (response.success) {
        message.success('Board deleted successfully');
        loadBoards();
        loadStats();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete board');
    }
  };

  const handleChangeRole = async (
    userId: string,
    newRole: 'user' | 'admin'
  ) => {
    try {
      const response = await adminApi.updateUserRole(userId, newRole);
      if (response.success) {
        message.success('Role updated successfully');
        loadUsers();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update role');
    }
  };

  const handleLogout = () => {
    removeToken();
    removeStoredUser();
    navigate('/login');
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // Apple 风格统计卡片
  const StatCard = ({
    title,
    value,
    icon,
    gradient,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient: string;
  }) => (
    <div
      className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
        style={{
          background: gradient,
          filter: 'blur(40px)',
          transform: 'translate(20%, -20%)',
        }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: gradient,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <span style={{ color: 'white', fontSize: 20 }}>{icon}</span>
        </div>
        <div
          className="text-3xl font-bold mb-1"
          style={{ color: '#1D1D1F', letterSpacing: '-0.02em' }}
        >
          {value.toLocaleString()}
        </div>
        <div style={{ color: '#6E6E73', fontSize: 14 }}>{title}</div>
      </div>
    </div>
  );

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={44}
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              fontWeight: 600,
            }}
          >
            {record.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold" style={{ color: '#1D1D1F' }}>
              {record.username}
            </div>
            <div style={{ color: '#86868B', fontSize: 13 }}>
              ID: {record.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string, record: User) => (
        <button
          onClick={() =>
            handleChangeRole(record.id, role === 'admin' ? 'user' : 'admin')
          }
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background:
              role === 'admin'
                ? 'linear-gradient(135deg, #FFD60A 0%, #FF9F0A 100%)'
                : 'rgba(0,0,0,0.06)',
            color: role === 'admin' ? '#1D1D1F' : '#6E6E73',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {role === 'admin' ? '👑 Admin' : '👤 User'}
        </button>
      ),
    },
    {
      title: 'Boards',
      dataIndex: 'board_count',
      key: 'board_count',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
          style={{
            background: 'rgba(0, 122, 255, 0.1)',
            color: '#007AFF',
          }}
        >
          {count}
        </span>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => (
        <span style={{ color: '#6E6E73' }}>
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const boardColumns = [
    {
      title: 'Board',
      key: 'board',
      render: (_: any, record: Board) => (
        <div>
          <div
            className="font-semibold flex items-center gap-2"
            style={{ color: '#1D1D1F' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  record.elements.length > 0
                    ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                    : '#C7C7CC',
              }}
            />
            {record.title}
          </div>
          <div style={{ color: '#86868B', fontSize: 13, marginTop: 4 }}>
            ID: {record.id.slice(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      title: 'Owner',
      key: 'owner',
      render: (_: any, record: Board) => (
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            style={{
              background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
            }}
          >
            {record.owner_name?.charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ color: '#1D1D1F' }}>{record.owner_name}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background:
              status === 'published'
                ? 'rgba(52, 199, 89, 0.1)'
                : 'rgba(142, 142, 147, 0.1)',
            color: status === 'published' ? '#34C759' : '#8E8E93',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: status === 'published' ? '#34C759' : '#8E8E93',
            }}
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Elements',
      dataIndex: 'elements',
      key: 'elements',
      width: 100,
      align: 'center' as const,
      render: (elements: any[]) => (
        <span style={{ color: '#6E6E73', fontWeight: 500 }}>
          {elements.length}
        </span>
      ),
    },
    {
      title: 'Last Modified',
      dataIndex: 'last_modified',
      key: 'last_modified',
      width: 150,
      render: (time: number) => (
        <span style={{ color: '#6E6E73' }}>{formatDate(time)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Board) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/board/${record.id}`)}
            style={{ color: '#007AFF' }}
          >
            View
          </Button>
          <Popconfirm
            title="Delete Board"
            description="Are you sure you want to delete this board?"
            onConfirm={() => handleDeleteBoard(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Overview' },
    { key: 'users', icon: <TeamOutlined />, label: 'Users' },
    { key: 'boards', icon: <AppstoreOutlined />, label: 'Boards' },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#F5F5F7' }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007AFF',
          colorBgBase: '#F5F5F7',
          colorBgContainer: '#FFFFFF',
          colorBorder: 'rgba(0, 0, 0, 0.06)',
          colorText: '#1D1D1F',
          colorTextSecondary: '#6E6E73',
          borderRadius: 12,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <Layout className="min-h-screen" style={{ background: '#F5F5F7' }}>
        {/* Sidebar */}
        <Sider
          width={280}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)',
                }}
              >
                <CrownOutlined style={{ color: 'white', fontSize: 20 }} />
              </div>
              <div>
                <Title level={4} className="!m-0 !text-gray-900">
                  Admin
                </Title>
                <Text style={{ fontSize: 12, color: '#6E6E73' }}>
                  Management
                </Text>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div
              className="text-xs font-semibold mb-3 px-4"
              style={{ color: '#86868B' }}
            >
              MENU
            </div>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all"
                style={{
                  background:
                    activeMenu === item.key
                      ? 'rgba(0, 122, 255, 0.1)'
                      : 'transparent',
                  color: activeMenu === item.key ? '#007AFF' : '#1D1D1F',
                }}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.key === 'users' && (
                  <Badge
                    count={users.length}
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      color: '#6E6E73',
                    }}
                  />
                )}
                {item.key === 'boards' && (
                  <Badge
                    count={boards.length}
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      color: '#6E6E73',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogoutOutlined />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </Sider>

        <Layout>
          {/* Header */}
          <Header
            className="flex items-center justify-between px-8"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              height: 72,
            }}
          >
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
              style={{ color: '#1D1D1F' }}
            >
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(0, 0, 0, 0.03)' }}
              >
                <Avatar
                  size={36}
                  style={{
                    background:
                      'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                  }}
                >
                  {currentUser?.username.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: '#1D1D1F' }}
                  >
                    {currentUser?.username}
                  </div>
                  <div style={{ fontSize: 12, color: '#86868B' }}>
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </Header>

          {/* Content */}
          <Content className="p-8">
            {activeMenu === 'dashboard' && (
              <div className="space-y-8">
                {/* Welcome Banner */}
                <div
                  className="relative overflow-hidden rounded-3xl p-8"
                  style={{
                    background:
                      'linear-gradient(135deg, #1D1D1F 0%, #3A3A3C 100%)',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30"
                    style={{
                      background:
                        'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                      filter: 'blur(80px)',
                      transform: 'translate(30%, -30%)',
                    }}
                  />
                  <div className="relative z-10">
                    <Badge
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        marginBottom: 16,
                      }}
                    >
                      ✨ Admin Dashboard
                    </Badge>
                    <h1
                      className="text-3xl font-bold text-white mb-2"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      System Overview
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
                      Monitor and manage your platform from this central hub.
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={<TeamOutlined />}
                    gradient="linear-gradient(135deg, #007AFF 0%, #5856D6 100%)"
                  />
                  <StatCard
                    title="Total Boards"
                    value={stats.boards}
                    icon={<AppstoreOutlined />}
                    gradient="linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)"
                  />
                  <StatCard
                    title="Published"
                    value={stats.publishedBoards}
                    icon={<FileTextOutlined />}
                    gradient="linear-gradient(135deg, #34C759 0%, #30D158 100%)"
                  />
                  <StatCard
                    title="Attachments"
                    value={stats.attachments}
                    icon={<FileImageOutlined />}
                    gradient="linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)"
                  />
                </div>

                {/* Recent Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card
                    title="Recent Users"
                    extra={
                      <Button
                        type="link"
                        onClick={() => setActiveMenu('users')}
                      >
                        View All →
                      </Button>
                    }
                    style={{ borderRadius: 16, border: 'none' }}
                  >
                    <Table
                      dataSource={users.slice(0, 5)}
                      columns={userColumns.slice(0, 4)}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  </Card>

                  <Card
                    title="Recent Boards"
                    extra={
                      <Button
                        type="link"
                        onClick={() => setActiveMenu('boards')}
                      >
                        View All →
                      </Button>
                    }
                    style={{ borderRadius: 16, border: 'none' }}
                  >
                    <Table
                      dataSource={boards.slice(0, 5)}
                      columns={boardColumns.slice(0, 5)}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </div>
              </div>
            )}

            {activeMenu === 'users' && (
              <Card
                title={
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                      }}
                    >
                      <TeamOutlined style={{ color: 'white' }} />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: '#1D1D1F' }}
                      >
                        All Users
                      </h2>
                      <p style={{ color: '#6E6E73', fontSize: 14 }}>
                        Manage user accounts
                      </p>
                    </div>
                  </div>
                }
                extra={
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: 'rgba(0,0,0,0.06)',
                      color: '#1D1D1F',
                    }}
                  >
                    {users.length} users
                  </span>
                }
                style={{ borderRadius: 16, border: 'none' }}
              >
                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                  }}
                />
              </Card>
            )}

            {activeMenu === 'boards' && (
              <Card
                title={
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                      }}
                    >
                      <AppstoreOutlined style={{ color: 'white' }} />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: '#1D1D1F' }}
                      >
                        All Boards
                      </h2>
                      <p style={{ color: '#6E6E73', fontSize: 14 }}>
                        Manage all boards
                      </p>
                    </div>
                  </div>
                }
                extra={
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: 'rgba(0,0,0,0.06)',
                      color: '#1D1D1F',
                    }}
                  >
                    {boards.length} boards
                  </span>
                }
                style={{ borderRadius: 16, border: 'none' }}
              >
                <Table
                  columns={boardColumns}
                  dataSource={boards}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                  }}
                />
              </Card>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
