import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport, ThemeColorMode } from '@plait/core';
import { MockAuthService, MockStorageService, BoardData, User } from '../services/mock-service';

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

  // Refs to hold latest values for saving without triggering re-renders
  const elementsRef = useRef<PlaitElement[]>([]);
  const viewportRef = useRef<Viewport | undefined>(undefined);
  const themeRef = useRef<PlaitTheme | undefined>(undefined);

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
  }, [boardId, navigate]);

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
    <div style={{ width: '100vw', height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Toolbar Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1000, 
        display: 'flex', 
        gap: '10px',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
             padding: '8px 16px',
             backgroundColor: 'white',
             border: '1px solid #ccc',
             borderRadius: '4px',
             cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>

        {showUpdateButton && (
          <button
            onClick={handleUpdate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {isOwner ? (boardData.status === 'published' ? 'Update (Published)' : 'Update & Publish') : 'Update'}
          </button>
        )}
      </div>

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
    </div>
  );
};
