import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import {
  Button,
  Upload,
  Card,
  Typography,
  Tag,
  Tooltip,
  message,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  ArrowLeftOutlined,
  FormatPainterOutlined,
  SaveOutlined,
  MoreOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

import {
  boardsApi,
  attachmentsApi,
  getStoredUser,
  User,
  Board,
  Attachment,
} from '../../api';

const { Text } = Typography;

export const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState<Board | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Drawnix state
  const [elements, setElements] = useState<PlaitElement[]>([]);
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined);
  const [theme, setTheme] = useState<PlaitTheme | undefined>(undefined);

  // EyeDropper
  const openEyeDropper = async () => {
    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      return result;
    } catch (e: any) {
      throw e;
    }
  };

  const isEyeDropperSupported = () => {
    return !!(window as any).EyeDropper;
  };

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentPanelVisible, setAttachmentPanelVisible] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Refs
  const elementsRef = useRef<PlaitElement[]>([]);
  const viewportRef = useRef<Viewport | undefined>(undefined);
  const themeRef = useRef<PlaitTheme | undefined>(undefined);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    if (boardId) {
      loadBoardData(boardId);
    }
  }, [boardId, navigate]);

  const loadBoardData = async (id: string) => {
    try {
      setLoading(true);
      const response = await boardsApi.getById(id);

      if (response.success && response.data) {
        const { board, attachments: boardAttachments } = response.data;
        setBoardData(board);
        setElements(board.elements);
        setViewport(board.viewport);
        setTheme({ themeColorMode: board.theme as any });
        setAttachments(boardAttachments);

        elementsRef.current = board.elements;
        viewportRef.current = board.viewport;
        themeRef.current = { themeColorMode: board.theme as any };
      } else {
        message.error('Board not found');
        navigate('/dashboard');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to load board');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // File icons
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImageOutlined style={{ color: '#007AFF', fontSize: 20 }} />;
    } else if (fileType.includes('pdf')) {
      return <FilePdfOutlined style={{ color: '#FF3B30', fontSize: 20 }} />;
    } else if (fileType.includes('text') || fileType.includes('markdown')) {
      return <FileTextOutlined style={{ color: '#5856D6', fontSize: 20 }} />;
    } else {
      return <FileZipOutlined style={{ color: '#8E8E93', fontSize: 20 }} />;
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Upload
  const handleUpload = async (file: File) => {
    if (!boardId) return false;

    setUploading(true);
    try {
      const response = await attachmentsApi.upload(boardId, file);
      if (response.success && response.data) {
        setAttachments((prev) => [...prev, response.data.attachment]);
        message.success('File uploaded successfully');
      }
    } catch (error: any) {
      message.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
    return false;
  };

  // Color pick
  const handleColorPick = async (attachmentId: string) => {
    try {
      if (!isEyeDropperSupported()) {
        message.warning('EyeDropper not supported in your browser');
        return;
      }

      const result = await openEyeDropper();
      const color = result.sRGBHex;

      const response = await attachmentsApi.updateColor(attachmentId, color);

      if (response.success && response.data) {
        setAttachments((prev) =>
          prev.map((attach) =>
            attach.id === attachmentId
              ? { ...attach, background_color: color }
              : attach
          )
        );
        message.success('Color updated');
      }
    } catch (e: any) {
      if (!e.canceled) {
        message.error('Failed to pick color');
      }
    }
  };

  const handleValueChange = useCallback((newElements: PlaitElement[]) => {
    elementsRef.current = newElements;
    setHasUnsavedChanges(true);
  }, []);

  const handleViewportChange = useCallback((newViewport: Viewport) => {
    viewportRef.current = newViewport;
    setHasUnsavedChanges(true);
  }, []);

  const handleThemeChange = useCallback((newThemeMode: any) => {
    themeRef.current = { themeColorMode: newThemeMode };
    setHasUnsavedChanges(true);
  }, []);

  const handleUpdate = async () => {
    if (!boardData || !user || !boardId) return;

    setSaving(true);
    try {
      const isOwner = boardData.owner_id === user.id;

      const updateData: Partial<Board> = {
        elements: elementsRef.current,
        viewport: viewportRef.current || boardData.viewport,
        theme: themeRef.current?.themeColorMode || boardData.theme,
        last_modified: Date.now(),
      };

      if (isOwner) {
        updateData.status = 'published';
      }

      const response = await boardsApi.update(boardId, updateData);

      if (response.success && response.data) {
        setBoardData(response.data.board);
        setHasUnsavedChanges(false);
        message.success(isOwner ? 'Board published!' : 'Changes saved!');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-center"
        style={{ background: '#F5F5F7' }}
      >
        <Spin size="large" tip="Loading board..." />
      </div>
    );
  }

  if (!boardData || !user) {
    return null;
  }

  const isOwner = boardData.owner_id === user.id;
  const showUpdateButton = isOwner || hasUnsavedChanges;

  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{ background: '#F5F5F7' }}
    >
      {/* Main canvas area */}
      <div className="flex-1 flex flex-col">
        {/* Top toolbar - Apple style */}
        <header
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-black/5"
              style={{ color: '#1D1D1F' }}
            >
              <ArrowLeftOutlined />
              <span className="font-medium">Back</span>
            </button>

            <div className="h-6 w-px bg-black/10" />

            <div>
              <h1
                className="font-semibold text-lg"
                style={{ color: '#1D1D1F' }}
              >
                {boardData.title}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      boardData.status === 'published'
                        ? 'rgba(52, 199, 89, 0.15)'
                        : 'rgba(142, 142, 147, 0.15)',
                    color:
                      boardData.status === 'published' ? '#34C759' : '#8E8E93',
                  }}
                >
                  {boardData.status === 'published' ? 'Published' : 'Draft'}
                </span>
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-500">● Unsaved</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-black/5 transition-colors">
              <ShareAltOutlined style={{ fontSize: 18, color: '#1D1D1F' }} />
            </button>
            <button className="p-2 rounded-xl hover:bg-black/5 transition-colors">
              <DownloadOutlined style={{ fontSize: 18, color: '#1D1D1F' }} />
            </button>
            {showUpdateButton && (
              <Button
                type="primary"
                onClick={handleUpdate}
                loading={saving}
                icon={<SaveOutlined />}
                style={{
                  height: '40px',
                  borderRadius: '10px',
                  fontWeight: 500,
                  background: '#007AFF',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)',
                }}
              >
                {isOwner
                  ? boardData.status === 'published'
                    ? 'Update'
                    : 'Publish'
                  : 'Save'}
              </Button>
            )}
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <Drawnix
            value={elements}
            viewport={viewport}
            theme={theme}
            onValueChange={handleValueChange}
            onViewportChange={handleViewportChange}
            onThemeChange={handleThemeChange}
          />
        </div>
      </div>

      {/* Right attachment panel */}
      <div
        className="flex flex-col border-l transition-all duration-300"
        style={{
          width: attachmentPanelVisible ? 340 : 0,
          background: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {attachmentPanelVisible && (
          <>
            {/* Toggle button */}
            <button
              onClick={() => setAttachmentPanelVisible(false)}
              className="absolute -left-10 top-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <MoreOutlined style={{ transform: 'rotate(90deg)' }} />
            </button>

            {/* Header */}
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}
            >
              <h3
                className="font-semibold text-lg"
                style={{ color: '#1D1D1F' }}
              >
                Attachments
              </h3>
              <p className="text-sm mt-1" style={{ color: '#6E6E73' }}>
                {attachments.length} files
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Upload area */}
              <Upload.Dragger
                name="file"
                multiple
                customRequest={({ file }) => handleUpload(file as File)}
                showUploadList={false}
                disabled={uploading}
                style={{
                  background: 'rgba(0, 122, 255, 0.04)',
                  border: '2px dashed rgba(0, 122, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '20px',
                }}
              >
                <div className="text-center">
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0, 122, 255, 0.1)' }}
                  >
                    <UploadOutlined
                      style={{ fontSize: 24, color: '#007AFF' }}
                    />
                  </div>
                  <p className="font-medium mb-1" style={{ color: '#1D1D1F' }}>
                    Click or drag to upload
                  </p>
                  <p className="text-xs" style={{ color: '#6E6E73' }}>
                    Support: Images, PDFs, Docs
                  </p>
                </div>
              </Upload.Dragger>

              {/* Attachments list */}
              <div className="space-y-3">
                {attachments.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    className="group"
                    style={{
                      background: item.background_color || '#F5F5F7',
                      borderRadius: '14px',
                      border: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    bodyStyle={{ padding: '14px' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.8)' }}
                      >
                        {getFileIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-sm truncate"
                          style={{ color: '#1D1D1F' }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: '#6E6E73' }}
                        >
                          {formatFileSize(item.size)} •{' '}
                          {new Date(item.upload_time).toLocaleDateString()}
                        </p>
                      </div>

                      <Tooltip title="Pick color">
                        <button
                          onClick={() => handleColorPick(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-black/5"
                        >
                          <FormatPainterOutlined style={{ color: '#007AFF' }} />
                        </button>
                      </Tooltip>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Show panel button when hidden */}
      {!attachmentPanelVisible && (
        <button
          onClick={() => setAttachmentPanelVisible(true)}
          className="absolute right-4 top-4 w-10 h-10 rounded-xl flex items-center justify-center transition-colors z-50"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          }}
        >
          <MoreOutlined style={{ transform: 'rotate(-90deg)' }} />
        </button>
      )}
    </div>
  );
};
