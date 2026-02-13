import React, { useEffect, useState } from 'react';
import { Alert, Select, Space, Tabs } from 'antd';
import { projectService, tradeService, categoryService, connectionService, installZoneService } from '../services';
import type * as Types from '../types';
import MetadataManager from '../components/metadata/MetadataManager';
import CategoryManager from '../components/metadata/CategoryManager';

const Metadata: React.FC = () => {
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

  const items = selectedProjectId ? [
    {
      key: 'trades',
      label: 'Gewerke',
      children: (
        <MetadataManager
          title="Gewerk"
          projectId={selectedProjectId}
          getData={tradeService.getByProject}
          createData={tradeService.create}
          updateData={tradeService.update}
          deleteData={tradeService.delete}
          showCode
          showOrder
          additionalFields={[
            { name: 'hgNumber', label: 'HG-Nummer', type: 'number' }
          ]}
        />
      ),
    },
    {
      key: 'categories',
      label: 'Kategorien',
      children: <CategoryManager projectId={selectedProjectId} />,
    },
    {
      key: 'connections',
      label: 'Anschlüsse',
      children: (
        <MetadataManager
          title="Anschluss"
          projectId={selectedProjectId}
          getData={connectionService.getByProject}
          createData={connectionService.create}
          updateData={connectionService.update}
          deleteData={connectionService.delete}
          showCode
          showOrder={false}
          additionalFields={[
            { name: 'voltage', label: 'Spannung', type: 'text' }
          ]}
        />
      ),
    },
    {
      key: 'installzones',
      label: 'Installationszonen',
      children: (
        <MetadataManager
          title="Installationszone"
          projectId={selectedProjectId}
          getData={installZoneService.getByProject}
          createData={installZoneService.create}
          updateData={installZoneService.update}
          deleteData={installZoneService.delete}
          showCode
          showOrder
        />
      ),
    },
  ] : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Metadaten</h1>
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
        <Tabs items={items} />
      ) : (
        <Alert
          message="Kein Projekt ausgewählt"
          description="Bitte wählen Sie ein Projekt aus, um Metadaten zu verwalten."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default Metadata;
