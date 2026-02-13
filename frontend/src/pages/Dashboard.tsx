import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { HomeOutlined, AppstoreOutlined, ToolOutlined } from '@ant-design/icons';
import { projectService, zoneService, roomService, deviceService } from '../services';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    projectsCount: 0,
    zonesCount: 0,
    roomsCount: 0,
    devicesCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const projects = await projectService.getAll();
      
      // For now, just count projects
      // In the future, we'll aggregate data from all projects
      setStats({
        projectsCount: projects.length,
        zonesCount: 0,
        roomsCount: 0,
        devicesCount: 0,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Fehler beim Laden der Statistiken');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Fehler" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Projekte"
              value={stats.projectsCount}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Zonen"
              value={stats.zonesCount}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Räume"
              value={stats.roomsCount}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Geräte"
              value={stats.devicesCount}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h2>Willkommen zum Elektro Raumbuch</h2>
        <p>
          Dies ist Ihre zentrale Planungsanwendung für Elektroinstallationen.
          Verwenden Sie das Menü auf der linken Seite, um zu navigieren.
        </p>
        <ul>
          <li><strong>Raumbuch:</strong> Verwalten Sie Projekte, Zonen und Räume</li>
          <li><strong>Item-Liste:</strong> Definieren Sie Geräte und weisen Sie sie Räumen zu</li>
          <li><strong>Metadaten:</strong> Konfigurieren Sie Gewerke, Verbindungen und Installationszonen</li>
          <li><strong>KNX:</strong> Gruppenadressverwaltung (Phase 2)</li>
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
