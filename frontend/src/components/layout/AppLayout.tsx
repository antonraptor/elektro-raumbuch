import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
