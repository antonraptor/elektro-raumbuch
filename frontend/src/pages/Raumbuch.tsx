import React, { useState } from 'react';
import { Row, Col, Alert, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type * as Types from '../types';
import ProjectList from '../components/raumbuch/ProjectList';
import ZoneManager from '../components/raumbuch/ZoneManager';
import RoomManager from '../components/raumbuch/RoomManager';
import ImportModal from '../components/raumbuch/ImportModal';

const Raumbuch: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Types.Project | null>(null);
  const [selectedZone, setSelectedZone] = useState<Types.Zone | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleImportSuccess = () => {
    setIsImportModalOpen(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Raumbuch</h1>
        <Button 
          type="default" 
          icon={<UploadOutlined />}
          onClick={() => setIsImportModalOpen(true)}
        >
          Excel importieren
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProjectList
            key={refreshKey}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setSelectedZone(null);
            }}
            selectedProjectId={selectedProject?.id}
          />
        </Col>

        {selectedProject && (
          <>
            <Col span={24}>
              <Alert
                message={`Projekt: ${selectedProject.name}`}
                description={selectedProject.description || 'Keine Beschreibung'}
                type="info"
                showIcon
              />
            </Col>

            <Col span={24} md={12}>
              <ZoneManager
                projectId={selectedProject.id}
                onSelectZone={setSelectedZone}
                selectedZoneId={selectedZone?.id}
              />
            </Col>

            <Col span={24} md={12}>
              {selectedZone ? (
                <RoomManager
                  projectId={selectedProject.id}
                  zoneId={selectedZone.id}
                />
              ) : (
                <Alert
                  message="Keine Zone ausgewählt"
                  description="Bitte wählen Sie eine Zone aus, um Räume zu verwalten."
                  type="warning"
                  showIcon
                />
              )}
            </Col>
          </>
        )}

        {!selectedProject && (
          <Col span={24}>
            <Alert
              message="Kein Projekt ausgewählt"
              description="Bitte erstellen Sie ein Projekt oder wählen Sie ein bestehendes Projekt aus."
              type="info"
              showIcon
            />
          </Col>
        )}
      </Row>

      <ImportModal
        open={isImportModalOpen}
        onSuccess={handleImportSuccess}
        onCancel={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default Raumbuch;
