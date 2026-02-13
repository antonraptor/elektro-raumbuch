import React, { useEffect, useState } from 'react';
import { Alert, Select, Space } from 'antd';
import { projectService } from '../services';
import type * as Types from '../types';
import DeviceList from '../components/devices/DeviceList';

const ItemListe: React.FC = () => {
  const [projects, setProjects] = useState<Types.Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      
      // Auto-select first project
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Item-Liste</h1>
        <Space>
          <span>Projekt:</span>
          <Select
            style={{ width: 300 }}
            placeholder="Projekt auswählen"
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            loading={loading}
          >
            {projects.map(project => (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </div>

      {selectedProjectId ? (
        <DeviceList projectId={selectedProjectId} />
      ) : (
        <Alert
          message="Kein Projekt ausgewählt"
          description="Bitte wählen Sie ein Projekt aus, um Geräte zu verwalten."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default ItemListe;
