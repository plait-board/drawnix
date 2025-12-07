import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport, ThemeColorMode } from '@plait/core';
import { Collapse, List, Button, Upload, Card, Typography, Space, Tag, Tooltip } from 'antd';
import { 
  UploadOutlined, 
  FileTextOutlined, 
  FileImageOutlined, 
  FilePdfOutlined, 
  FileZipOutlined, 
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FormatPainterOutlined
} from '@ant-design/icons';

import { MockAuthService, MockStorageService, BoardData, User } from '../services/mock-service';

const { Panel } = Collapse;
const { Text } = Typography;
const { Dragger } = Upload;

// 附件类型定义
interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadTime: number;
  backgroundColor: string;
}

export const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Drawnix state
  const [elements, setElements] = useState<PlaitElement[]>([]);
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
  const [theme, setTheme] = useState<PlaitTheme | undefined>(undefined);

  // 使用 use-eye-dropper hook
  // 注意：use-eye-dropper 包的实际用法可能不同，这里使用 try-catch 避免错误
  const openEyeDropper = async () => {
    try {
      // 直接调用系统吸管API
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      return result;
    } catch (e: any) {
      throw e;
    }
  };

  // 检查浏览器是否支持系统吸管
  const isEyeDropperSupported = () => {
    return !!(window as any).EyeDropper;
  };
  
  // 附件相关状态
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentPanelVisible, setAttachmentPanelVisible] = useState(true);
  
  // 模拟附件数据
  const mockAttachments: Attachment[] = [
    {
      id: '1',
      name: '项目计划.md',
      size: 1024 * 1024,
      type: 'text/markdown',
      url: '#',
      uploadTime: Date.now() - 3600000,
      backgroundColor: '#f0f9ff'
    },
    {
      id: '2',
      name: '设计稿.pdf',
      size: 2048 * 1024,
      type: 'application/pdf',
      url: '#',
      uploadTime: Date.now() - 7200000,
      backgroundColor: '#fef3c7'
    },
    {
      id: '3',
      name: '演示视频.mp4',
      size: 51200 * 1024,
      type: 'video/mp4',
      url: '#',
      uploadTime: Date.now() - 10800000,
      backgroundColor: '#ecfdf5'
    }
  ];

  // Refs to hold latest values for saving without triggering re-renders
  const elementsRef = useRef<PlaitElement[]>([]);
  const viewportRef = useRef<Viewport | undefined>(undefined);
  const themeRef = useRef<PlaitTheme | undefined>(undefined);
  const attachmentRef = useRef<Attachment[]>([]);

  useEffect(() => {
    const currentUser = MockAuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    if (boardId) {
      const data = MockStorageService.getBoard(boardId);
      if (data) {
        setBoardData(data);
        setElements(data.elements);
        setViewport(data.viewport);
        setTheme({ themeColorMode: data.theme });
        
        elementsRef.current = data.elements;
        viewportRef.current = data.viewport;
        themeRef.current = { themeColorMode: data.theme };
      } else {
        alert('Board not found');
        navigate('/dashboard');
      }
    }
    
    // 初始化附件数据
    setAttachments(mockAttachments);
    attachmentRef.current = mockAttachments;
  }, [boardId, navigate]);

  // 文件类型图标映射
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('text') || fileType.includes('markdown')) {
      return <FileTextOutlined style={{ color: '#667eea' }} />;
    } else if (fileType.includes('image')) {
      return <FileImageOutlined style={{ color: '#ec4899' }} />;
    } else if (fileType.includes('pdf')) {
      return <FilePdfOutlined style={{ color: '#ef4444' }} />;
    } else if (fileType.includes('video')) {
      return <FileTextOutlined style={{ color: '#10b981' }} />;
    } else if (fileType.includes('audio')) {
      return <FileTextOutlined style={{ color: '#f59e0b' }} />;
    } else if (fileType.includes('zip') || fileType.includes('compress')) {
      return <FileZipOutlined style={{ color: '#8b5cf6' }} />;
    } else {
      return <FileTextOutlined style={{ color: '#6b7280' }} />;
    }
  };

  // 文件大小格式化
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };

  // 处理文件上传
  const handleUpload = (file: any) => {
    // 模拟上传成功
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: '#',
      uploadTime: Date.now(),
      backgroundColor: '#f0f9ff'
    };
    
    const updatedAttachments = [...attachments, newAttachment];
    setAttachments(updatedAttachments);
    attachmentRef.current = updatedAttachments;
    
    return false; // 阻止自动上传
  };

  // 处理颜色吸取
  const handleColorPick = async (attachmentId: string) => {
    try {
      // 检查浏览器是否支持系统吸管
      if (!isEyeDropperSupported()) {
        alert('您的浏览器不支持系统吸管功能');
        return;
      }
      
      // 打开系统吸管
      const result = await openEyeDropper();
      
      // 获取拾取的颜色
      const color = result.sRGBHex;
      
      // 更新附件背景色
      const updatedAttachments = attachments.map(attach => {
        if (attach.id === attachmentId) {
          return { ...attach, backgroundColor: color };
        }
        return attach;
      });
      
      setAttachments(updatedAttachments);
      attachmentRef.current = updatedAttachments;
    } catch (e: any) {
      // 用户按 ESC 取消会走这里，不需要处理
      if (!e.canceled) {
        console.error('颜色拾取失败:', e);
        alert('颜色拾取失败');
      }
    }
  };

  // 切换附件面板可见性
  const toggleAttachmentPanel = () => {
    setAttachmentPanelVisible(!attachmentPanelVisible);
  };

  const handleValueChange = useCallback((newElements: PlaitElement[]) => {
      elementsRef.current = newElements;
      setHasUnsavedChanges(true);
  }, []);

  const handleViewportChange = useCallback((newViewport: Viewport) => {
      viewportRef.current = newViewport;
      // Viewport change alone might not trigger "Update" button for User B, strictly speaking,
      // but usually saving viewport is good. Requirement says "edits/annotates", which usually means content.
      // I will count viewport change as unsaved change for User A, maybe not for B if strict.
      // Let's assume any change counts for now.
      setHasUnsavedChanges(true);
  }, []);

  const handleThemeChange = useCallback((newThemeMode: ThemeColorMode) => {
      themeRef.current = { themeColorMode: newThemeMode };
      setHasUnsavedChanges(true);
  }, []);

  const handleUpdate = () => {
    if (!boardData || !user) return;

    const updatedBoard: BoardData = {
      ...boardData,
      elements: elementsRef.current,
      viewport: viewportRef.current || boardData.viewport,
      theme: themeRef.current?.themeColorMode || boardData.theme,
      lastModified: Date.now()
    };

    const isOwner = boardData.ownerId === user.id;

    if (isOwner) {
      // User A logic: Save and Publish
      updatedBoard.status = 'published';
      MockStorageService.saveBoard(updatedBoard);
      setBoardData(updatedBoard);
      setHasUnsavedChanges(false);
      alert('Board updated and published successfully!');
    } else {
      // User B logic: Save "others' data" (here we just update the board in place for simplicity, 
      // or we could fork it. Requirement says "update is others data").
      // "b customer has right to see ... if b customer edits ... update is others data"
      // This implies B is allowed to edit A's board.
      MockStorageService.saveBoard(updatedBoard);
      setBoardData(updatedBoard);
      setHasUnsavedChanges(false);
      alert('Update complete!');
    }
  };

  if (!boardData || !user) return <div>Loading...</div>;

  const isOwner = boardData.ownerId === user.id;
  // Show update button if:
  // 1. User is Owner (A) - Always show or only when changed? 
  //    Req: "completed... update button... update means save... status becomes published"
  //    It implies it's a step. Let's show it always for A or when draft.
  //    "After update, status becomes published". 
  // 2. User is Viewer (B) - "User B can see... if B edits... also has update... update complete give prompt"
  //    "Unmodified -> update button does not exist"
  
  const showUpdateButton = isOwner || hasUnsavedChanges;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', display: 'flex' }}>

      {/* 黑板区域 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Drawnix
          value={elements}
          viewport={viewport}
          theme={theme}
          onValueChange={handleValueChange}
          onViewportChange={handleViewportChange}
          onThemeChange={handleThemeChange}
        />
      </div>

      {/* 右侧附件面板 */}
      <div style={{ 
        width: attachmentPanelVisible ? 360 : 0, 
        height: '100vh', 
        background: '#ffffff',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.06)',
        borderLeft: '1px solid #f0f2f5',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        
        {/* 折叠按钮 - 放在附件列表内部 */}
        <div 
          style={{ 
            position: 'absolute',
            right: 16,
            top: 16,
            width: 32,
            height: 32,
            background: '#ffffff',
            border: '1px solid #f0f2f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            zIndex: 101,
            transition: 'all 0.3s ease',
          }}
          onClick={toggleAttachmentPanel}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
          }}
        >
          <div style={{ transition: 'all 0.3s ease' }}>
            {attachmentPanelVisible ? (
              <ArrowLeftOutlined style={{ fontSize: 14, color: '#6b7280' }} />
            ) : (
              <ArrowRightOutlined style={{ fontSize: 14, color: '#6b7280' }} />
            )}
          </div>
        </div>

        {attachmentPanelVisible && (
          <>
            {/* 附件面板标题 */}
            <div style={{ 
              padding: '16px 24px',
              borderBottom: '1px solid #f0f2f5',
              background: '#f9fafb',
              fontWeight: 600,
              color: '#2d3748',
              fontSize: 16
            }}>
              附件列表
            </div>

            {/* 附件列表内容 */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {/* 操作按钮区 */}
              <div style={{ 
                display: 'flex', 
                gap: 12, 
                marginBottom: 20 
              }}>
                <Button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#cbd5e0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  返回仪表板
                </Button>

                {showUpdateButton && (
                  <Button
                    onClick={handleUpdate}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1565c0';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1976d2';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(25, 118, 210, 0.2)';
                    }}
                  >
                    {isOwner ? (boardData.status === 'published' ? '更新 (已发布)' : '更新 & 发布') : '更新'}
                  </Button>
                )}
              </div>

              {/* 上传按钮 */}
              <Dragger
                name="files"
                multiple
                customRequest={handleUpload}
                beforeUpload={handleUpload}
                showUploadList={false}
                style={{
                  marginBottom: 20,
                  border: '2px dashed #e2e8f0',
                  borderRadius: 12,
                  backgroundColor: '#f9fafb',
                  padding: '24px'
                }}
              >
                <Space orientation="vertical" align="center">
                  <UploadOutlined style={{ fontSize: 32, color: '#667eea'}} />
                  <Text strong style={{ color: '#4b5563' }}>点击或拖拽文件上传</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    支持上传 PPT、MD、图片、视频、音频等文件
                  </Text>
                </Space>
              </Dragger>

              {/* 附件列表 */}
              <List
                dataSource={attachments}
                renderItem={(item) => (
                  <Card
                    key={item.id}
                    style={{
                      marginBottom: 12,
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      background: item.backgroundColor,
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    hoverable
                  >
                    {/* 颜色吸取按钮 */}
                    <Tooltip title="吸取颜色">
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          left: 12,
                          width: 28,
                          height: 28,
                          borderRadius: 50,
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                        }}
                        onClick={() => handleColorPick(item.id)}
                      >
                        <FormatPainterOutlined style={{ fontSize: 16, color: '#6b7280' }} />
                      </div>
                    </Tooltip>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* 文件图标 */}
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 8, 
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e2e8f0',
                        flexShrink: 0
                      }}>
                        {getFileIcon(item.type)}
                      </div>

                      {/* 文件信息 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text strong style={{ color: '#2d3748', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </Text>
                          <Tag 
                            size="small" 
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid #e2e8f0',
                              fontSize: 10
                            }}
                          >
                            {item.type.split('/')[1]}
                          </Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {formatFileSize(item.size)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(item.uploadTime).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              />

              {/* 说明文字 */}
              <div style={{ 
                marginTop: 24,
                padding: 16,
                background: '#fef3c7',
                borderRadius: 8,
                border: '1px solid #fde68a'
              }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <strong>提示：</strong>此附件列表用于给黑板中的内容区块提供文件支撑，您可以通过颜色吸取功能快速匹配对应的内容区块。
                </Text>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
