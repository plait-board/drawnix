import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Input,
  Button,
  Form,
  Typography,
  message,
  Popconfirm,
  Empty,
  Spin,
  Badge,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  LogoutOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SettingOutlined,
  FolderOutlined,
  GlobalOutlined,
  RightOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  boardsApi,
  getStoredUser,
  removeToken,
  removeStoredUser,
  User,
  Board,
} from '../../api';

const { Title, Text } = Typography;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [myBoards, setMyBoards] = useState<Board[]>([]);
  const [publishedBoards, setPublishedBoards] = useState<Board[]>([]);
  const [filteredMyBoards, setFilteredMyBoards] = useState<Board[]>([]);
  const [filteredPublishedBoards, setFilteredPublishedBoards] = useState<
    Board[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadBoards();
  }, [navigate]);

  useEffect(() => {
    filterBoards();
  }, [searchQuery, myBoards, publishedBoards]);

  const loadBoards = async () => {
    try {
      setPageLoading(true);
      const response = await boardsApi.getAll();
      if (response.success && response.data) {
        setMyBoards(response.data.myBoards);
        setPublishedBoards(response.data.publishedBoards);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to load boards');
    } finally {
      setPageLoading(false);
    }
  };

  const filterBoards = () => {
    const query = searchQuery.toLowerCase();
    setFilteredMyBoards(
      myBoards.filter((board) => board.title.toLowerCase().includes(query))
    );
    setFilteredPublishedBoards(
      publishedBoards.filter((board) =>
        board.title.toLowerCase().includes(query)
      )
    );
  };

  const handleCreateBoard = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await boardsApi.create(values.title);

      if (response.success && response.data) {
        message.success('Board created successfully!');
        setIsModalVisible(false);
        form.resetFields();
        navigate(`/board/${response.data.board.id}`);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await boardsApi.delete(boardId);
      if (response.success) {
        message.success('Board deleted successfully');
        loadBoards();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete board');
    }
  };

  const handleLogout = () => {
    removeToken();
    removeStoredUser();
    navigate('/login');
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  // Apple 风格 Board 卡片
  const BoardCard = ({
    board,
    isOwner,
  }: {
    board: Board;
    isOwner: boolean;
  }) => (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className="group relative cursor-pointer"
      style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow:
          '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow =
          '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)';
      }}
    >
      {/* 预览区域 */}
      <div
        className="relative h-40 overflow-hidden"
        style={{
          background:
            board.elements.length > 0
              ? 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)'
              : 'linear-gradient(135deg, #F5F5F7 0%, #EEEEF0 100%)',
        }}
      >
        {/* 装饰元素 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {board.elements.length > 0 ? (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C7C7CC 0%, #8E8E93 100%)',
                opacity: 0.3,
              }}
            >
              <PlusOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
          )}
        </div>

        {/* 元素数量徽章 */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#1D1D1F',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {board.elements.length} items
        </div>

        {/* 状态标签 */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background:
              board.status === 'published'
                ? 'rgba(52, 199, 89, 0.15)'
                : 'rgba(142, 142, 147, 0.15)',
            color: board.status === 'published' ? '#34C759' : '#8E8E93',
            backdropFilter: 'blur(10px)',
          }}
        >
          {board.status === 'published' ? '● Published' : '○ Draft'}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        <h3
          className="font-semibold text-lg mb-2 truncate"
          style={{ color: '#1D1D1F', letterSpacing: '-0.01em' }}
        >
          {board.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined style={{ color: '#86868B', fontSize: 14 }} />
            <span style={{ color: '#86868B', fontSize: 14 }}>
              {formatDate(board.last_modified)}
            </span>
          </div>

          {isOwner && (
            <Popconfirm
              title="Delete Board"
              description="Are you sure you want to delete this board?"
              onConfirm={(e) => handleDeleteBoard(board.id, e as any)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-red-50"
              >
                <DeleteOutlined style={{ color: '#FF3B30' }} />
              </button>
            </Popconfirm>
          )}
        </div>
      </div>
    </div>
  );

  if (pageLoading) {
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
    <div className="min-h-screen" style={{ background: '#F5F5F7' }}>
      {/* 顶部导航 - Apple 风格 */}
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
            </div>
            <span
              className="text-xl font-semibold"
              style={{ color: '#1D1D1F', letterSpacing: '-0.02em' }}
            >
              Drawnix
            </span>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <SearchOutlined
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: '#86868B', fontSize: 18 }}
              />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  paddingLeft: '44px',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.06)';
                  e.target.style.borderColor = 'rgba(0,122,255,0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.04)';
                  e.target.style.borderColor = 'rgba(0,0,0,0.08)';
                }}
              />
            </div>
          </div>

          {/* 右侧用户菜单 */}
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateBoard}
              style={{
                height: '40px',
                borderRadius: '10px',
                fontWeight: 500,
                background: '#007AFF',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)',
              }}
            >
              New Board
            </Button>

            <Dropdown
              menu={{
                items: [
                  {
                    key: 'admin',
                    icon: <SettingOutlined />,
                    label: 'Admin Panel',
                    onClick: () => navigate('/admin'),
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Sign Out',
                    danger: true,
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors hover:bg-black/5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm"
                  style={{
                    background:
                      'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                  }}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </button>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 欢迎区域 */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: '#1D1D1F', letterSpacing: '-0.02em' }}
          >
            Good{' '}
            {new Date().getHours() < 12
              ? 'morning'
              : new Date().getHours() < 18
              ? 'afternoon'
              : 'evening'}
            , {user?.username}
          </h1>
          <p style={{ color: '#6E6E73', fontSize: '17px' }}>
            Here's what's happening with your boards
          </p>
        </div>

        {/* 我的黑板区域 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2
                className="text-xl font-semibold"
                style={{ color: '#1D1D1F' }}
              >
                My Boards
              </h2>
              <Badge
                count={myBoards.length}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  color: '#6E6E73',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* 视图切换 */}
            <div
              className="flex items-center p-1 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.04)' }}
            >
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-md transition-all"
                style={{
                  background: viewMode === 'grid' ? 'white' : 'transparent',
                  boxShadow:
                    viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <AppstoreOutlined
                  style={{ color: viewMode === 'grid' ? '#007AFF' : '#86868B' }}
                />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-md transition-all"
                style={{
                  background: viewMode === 'list' ? 'white' : 'transparent',
                  boxShadow:
                    viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <UnorderedListOutlined
                  style={{ color: viewMode === 'list' ? '#007AFF' : '#86868B' }}
                />
              </button>
            </div>
          </div>

          {filteredMyBoards.length === 0 ? (
            <Empty
              description={
                searchQuery
                  ? 'No boards match your search'
                  : 'Create your first board to get started'
              }
              className="py-16"
              image={
                <div
                  className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #F5F5F7 0%, #E5E5E5 100%)',
                  }}
                >
                  <FolderOutlined style={{ fontSize: 40, color: '#C7C7CC' }} />
                </div>
              }
            >
              {!searchQuery && (
                <Button
                  type="primary"
                  onClick={handleCreateBoard}
                  style={{
                    height: '44px',
                    borderRadius: '12px',
                    background: '#007AFF',
                  }}
                >
                  Create your first board
                </Button>
              )}
            </Empty>
          ) : (
            <div
              className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {filteredMyBoards.map((board) => (
                <BoardCard key={board.id} board={board} isOwner={true} />
              ))}
            </div>
          )}
        </div>

        {/* 社区黑板区域 */}
        {filteredPublishedBoards.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: '#1D1D1F' }}
              >
                Community Boards
              </h2>
              <Badge
                count={filteredPublishedBoards.length}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  color: '#6E6E73',
                  fontWeight: 500,
                }}
              />
            </div>

            <div
              className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {filteredPublishedBoards.map((board) => (
                <BoardCard key={board.id} board={board} isOwner={false} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 创建 Board Modal - Apple 风格 */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={480}
        centered
        className="apple-modal"
      >
        <div className="p-2">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: '#1D1D1F', letterSpacing: '-0.02em' }}
          >
            Create New Board
          </h2>
          <p className="mb-8" style={{ color: '#6E6E73' }}>
            Start with a blank canvas and bring your ideas to life
          </p>

          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label={
                <span style={{ color: '#1D1D1F', fontWeight: 500 }}>
                  Board Name
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Please enter a name for your board',
                },
                { min: 2, message: 'Name must be at least 2 characters' },
                { max: 50, message: 'Name must be less than 50 characters' },
              ]}
            >
              <Input
                placeholder="e.g., Project Ideas, Meeting Notes..."
                size="large"
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  fontSize: '16px',
                }}
              />
            </Form.Item>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={handleModalCancel}
                size="large"
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleModalOk}
                loading={loading}
                size="large"
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '12px',
                  background: '#007AFF',
                  fontWeight: 500,
                  border: 'none',
                }}
              >
                Create Board
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
