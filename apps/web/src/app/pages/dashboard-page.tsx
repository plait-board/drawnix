import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Input, Button, Form, Typography } from 'antd';
import { MockAuthService, MockStorageService, BoardData, User } from '../services/mock-service';

const { Title } = Typography;

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [myBoards, setMyBoards] = useState<BoardData[]>([]);
  const [publishedBoards, setPublishedBoards] = useState<BoardData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = MockAuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    refreshBoards(currentUser.id);
  }, [navigate]);

  const refreshBoards = (userId: string) => {
    setMyBoards(MockStorageService.getBoards(userId));
    setPublishedBoards(MockStorageService.getPublishedBoards().filter(b => b.ownerId !== userId));
  };

  const handleCreateBoard = () => {
    if (user) {
      setIsModalVisible(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (user) {
        const newBoard = MockStorageService.createBoard(user.id, values.title);
        setIsModalVisible(false);
        form.resetFields();
        navigate(`/board/${newBoard.id}`);
      }
    } catch (error) {
      // Form validation failed
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    MockAuthService.logout();
    navigate('/login');
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f9',
      fontFamily: "'Inter', sans-serif",
      color: '#333'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>D</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#2d3748' }}>Drawnix</h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e0',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#edf2f7';
              e.currentTarget.style.borderColor = '#a0aec0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
          >
            Admin
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4a5568',
              fontWeight: '600'
            }}>
              {user?.username.charAt(0)}
            </div>
            <span style={{ fontWeight: '500', color: '#4a5568' }}>{user?.username}</span>
          </div>
          <button 
            onClick={handleLogout} 
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e0',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#edf2f7';
              e.currentTarget.style.borderColor = '#a0aec0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* My Boards Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>我的黑板</h2>
            <button 
              onClick={handleCreateBoard}
              style={{ 
                padding: '0.75rem 1.5rem', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(52, 152, 219, 0.25)',
                transition: 'transform 0.1s, box-shadow 0.2s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> 创建新黑板
            </button>
          </div>

          {myBoards.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '3rem', 
              textAlign: 'center',
              border: '1px dashed #cbd5e0'
            }}>
              <p style={{ color: '#a0aec0', fontSize: '1.1rem', marginBottom: '1rem' }}>You haven't created any boards yet.</p>
              <button 
                onClick={handleCreateBoard}
                style={{ color: '#3498db', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                Create your first board
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {myBoards.map(board => (
                <div 
                  key={board.id} 
                  onClick={() => navigate(`/board/${board.id}`)}
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    border: '1px solid transparent',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '140px', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Placeholder for thumbnail */}
                    <div style={{ fontSize: '2rem', opacity: 0.2 }}>🎨</div>
                  </div>
                  
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {board.title}
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px',
                      fontWeight: '600',
                      backgroundColor: board.status === 'published' ? '#def7ec' : '#fffaf0',
                      color: board.status === 'published' ? '#03543f' : '#9c4221'
                    }}>
                      {board.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                      {formatDate(board.lastModified).split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Community Boards Section */}
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem' }}>社区黑板</h2>
          
          {publishedBoards.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '3rem', 
              textAlign: 'center',
              border: '1px dashed #cbd5e0'
            }}>
              <p style={{ color: '#a0aec0' }}>暂无其他用户发布的黑板。</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {publishedBoards.map(board => (
                <div 
                  key={board.id} 
                  onClick={() => navigate(`/board/${board.id}`)}
                  style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    border: '1px solid transparent',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '140px', 
                    backgroundColor: '#edf2f7', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                     <div style={{ fontSize: '2rem', opacity: 0.3 }}>🌍</div>
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                    {board.title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#cbd5e0', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       U
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#718096' }}>Owner ID: {board.ownerId.substring(0, 6)}...</span>
                  </div>

                  <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                     <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                      Updated {formatDate(board.lastModified).split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Custom Modal for Creating New Board */}
      <Modal
        title={<Title level={4} style={{ margin: 0, color: '#2d3748', fontWeight: 600 }}>创建新黑板</Title>}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null}
        width={500}
        centered
        styles={{
          header: { borderBottom: '1px solid #f0f2f5', padding: '20px 24px' },
          body: { padding: '24px' },
          footer: { borderTop: '1px solid #f0f2f5', padding: '16px 24px' },
          content: { borderRadius: '12px' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ title: '' }}
        >
          <Form.Item
            name="title"
            label={<span style={{ color: '#4a5568', fontWeight: 500, fontSize: '14px' }}>黑板标题</span>}
            rules={[
              { required: true, message: '请输入黑板标题!' },
              { min: 2, message: '标题必须至少包含 2 个字符!' },
              { max: 50, message: '标题最多包含 50 个字符!' }
            ]}
            colon={false}
            style={{ marginBottom: 24 }}
          >
            <Input
              placeholder="输入黑板标题..."
              size="large"
              style={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                height: '44px',
                fontSize: '16px',
                '&:hover': {
                  borderColor: '#cbd5e0',
                },
                '&:focus': {
                  borderColor: '#667eea',
                  boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                },
              }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 20 }}>
            <Button
              onClick={handleModalCancel}
              size="large"
              style={{
                borderRadius: '8px',
                padding: '0 24px',
                height: '44px',
                borderColor: '#e2e8f0',
                color: '#4a5568',
                fontWeight: 500,
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleModalOk}
              loading={loading}
              size="large"
              style={{
                borderRadius: '8px',
                padding: '0 24px',
                height: '44px',
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#5a67d8',
                  borderColor: '#5a67d8',
                },
              }}
            >
              创建黑板
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
