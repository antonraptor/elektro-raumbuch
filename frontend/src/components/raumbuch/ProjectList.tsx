import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { projectService } from '../../services';
import type * as Types from '../../types';
import ProjectForm from './ProjectForm';

interface ProjectListProps {
  onSelectProject: (project: Types.Project) => void;
  selectedProjectId?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject, selectedProjectId }) => {
  const [projects, setProjects] = useState<Types.Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Types.Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      
      // Auto-select first project if none selected
      if (data.length > 0 && !selectedProjectId) {
        onSelectProject(data[0]);
      }
    } catch (error) {
      message.error('Fehler beim Laden der Projekte');
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Types.Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await projectService.delete(id);
      message.success('Projekt gelöscht');
      loadProjects();
    } catch (error) {
      message.error('Fehler beim Löschen des Projekts');
      console.error('Failed to delete project:', error);
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    setEditingProject(null);
    await loadProjects();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Beschreibung',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Types.Project) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Projekt löschen?"
            description="Sind Sie sicher? Alle Zonen und Räume werden ebenfalls gelöscht."
            onConfirm={() => handleDelete(record.id)}
            okText="Ja"
            cancelText="Nein"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Projekte"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Neues Projekt
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          pagination={false}
          rowClassName={(record) => record.id === selectedProjectId ? 'selected-row' : ''}
          onRow={(record) => ({
            onClick: () => onSelectProject(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      <ProjectForm
        open={isModalOpen}
        project={editingProject}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
      />
    </>
  );
};

export default ProjectList;
