import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { BoardPage } from './pages/board-page';
import { AdminPage } from './pages/admin-page';
import { MockStorageService } from './services/mock-service';

// Initialize mock data
MockStorageService.init();

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
