import React from 'react';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  return (
    <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center' }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: onToggle,
        style: { fontSize: '18px', padding: '0 24px', cursor: 'pointer' },
      })}
      <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
        Elektro Raumbuch
      </h1>
    </Header>
  );
};

export default AppHeader;
