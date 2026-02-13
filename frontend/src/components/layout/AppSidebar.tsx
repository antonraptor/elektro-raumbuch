import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/raumbuch',
      icon: <HomeOutlined />,
      label: 'Raumbuch',
    },
    {
      key: '/items',
      icon: <UnorderedListOutlined />,
      label: 'Item-Liste',
    },
    {
      key: '/metadata',
      icon: <DatabaseOutlined />,
      label: 'Metadaten',
    },
    {
      key: '/knx',
      icon: <AppstoreOutlined />,
      label: 'KNX (Phase 2)',
      disabled: true,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Einstellungen',
    },
  ];

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ 
        height: '32px', 
        margin: '16px', 
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
      }}>
        {!collapsed && 'ER'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;
