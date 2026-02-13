import React, { useState } from 'react';
import { Row, Col, Alert } from 'antd';
import type * as Types from '../types';
import ProjectList from '../components/raumbuch/ProjectList';
import ZoneManager from '../components/raumbuch/ZoneManager';
import RoomManager from '../components/raumbuch/RoomManager';

const Raumbuch: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Types.Project | null>(null);
  const [selectedZone, setSelectedZone] = useState<Types.Zone | null>(null);

  return (
    <div>
      <h1>Raumbuch</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProjectList
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
    </div>
  );
};

export default Raumbuch;
