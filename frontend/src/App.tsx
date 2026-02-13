import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import deDE from 'antd/locale/de_DE';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Raumbuch from './pages/Raumbuch';
import ItemListe from './pages/ItemListe';
import Metadata from './pages/Metadata';
import Settings from './pages/Settings';

function App() {
  return (
    <ConfigProvider locale={deDE}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="raumbuch" element={<Raumbuch />} />
            <Route path="items" element={<ItemListe />} />
            <Route path="metadata" element={<Metadata />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
